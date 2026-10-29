const COST_API = '/api/cost-management/v1';
const OPENSHIFT_SOURCE_TYPE_ID = '5';
const COST_MANAGEMENT_APP_ID = '2';
const PAUSED_AT_PLACEHOLDER = '1970-01-01T00:00:00.000Z';

const openshiftSourceType = {
  category: 'Red Hat',
  icon_url: '',
  id: OPENSHIFT_SOURCE_TYPE_ID,
  name: 'openshift',
  product_name: 'OpenShift Container Platform',
  schema: {
    authentication: [
      {
        fields: [
          // Cluster Identifier only. A hidden authentication.authtype field with
          // initialValue registers a nested value the edit form treats as a
          // change, so Save changes and Reset flash on. The wizard still sets
          // the token type from its own step.
          {
            component: 'text-field',
            label: 'Cluster Identifier',
            name: 'source.source_ref',
          },
        ],
        name: 'Token',
        type: 'token',
      },
    ],
    endpoint: {
      fields: [],
      hidden: true,
    },
  },
  vendor: 'Red Hat',
};

const costApplicationType = {
  dependent_applications: [],
  display_name: 'Cost Management',
  id: COST_MANAGEMENT_APP_ID,
  name: '/insights/platform/cost-management',
  supported_authentication_types: {
    openshift: ['token'],
  },
  supported_source_types: ['openshift'],
};

const detailOf = error => {
  const data = error && error.response && error.response.data;
  if (typeof data === 'string' && data) {
    return data;
  }
  if (data && data.errors && data.errors[0] && data.errors[0].detail) {
    return data.errors[0].detail;
  }
  if (data && typeof data.detail === 'string') {
    return data.detail;
  }
  if (error && error.errors && error.errors[0] && error.errors[0].detail) {
    return error.errors[0].detail;
  }
  if (error && typeof error.detail === 'string') {
    return error.detail;
  }
  if (error && typeof error.message === 'string' && error.message) {
    return error.message;
  }
  return 'Request failed';
};

const apiError = detail => {
  const error = new Error(detail);
  error.detail = detail;
  error.errors = [{ detail }];
  return error;
};

const statusOf = error => error && error.response && error.response.status;

const rowsOf = body => {
  if (Array.isArray(body)) {
    return body;
  }
  if (body && Array.isArray(body.data)) {
    return body.data;
  }
  return [];
};

const countOf = (body, rows) => {
  if (body && body.meta && typeof body.meta.count === 'number') {
    return body.meta.count;
  }
  return rows.length;
};

const isOpenShift = source => source && source.source_type === 'OCP';

const pipelineComplete = source =>
  ['download', 'processing', 'summary'].every(
    key => source && source.status && source.status[key] && source.status[key].state === 'complete'
  );

const availabilityStatus = source => {
  if (!source || source.paused) {
    return 'unavailable';
  }
  // Settings shows Available from the provider active flag. A new integration is
  // active before Cost has a report manifest, so status is still empty.
  if (typeof source.active === 'boolean') {
    return source.active ? 'available' : 'unavailable';
  }
  return pipelineComplete(source) ? 'available' : 'unavailable';
};

const toSourcesRecord = source => {
  if (!source) {
    return null;
  }
  const status = availabilityStatus(source);
  const pausedAt = source.paused ? source.updated_timestamp || source.created_timestamp || PAUSED_AT_PLACEHOLDER : null;
  const id = String(source.uuid || source.id);
  const numericId = source.id != null ? String(source.id) : id;
  const sourceRef =
    source.source_ref ||
    (source.authentication && source.authentication.credentials && source.authentication.credentials.cluster_id) ||
    null;

  return {
    app_creation_workflow: 'manual_configuration',
    applications: [
      {
        application_type_id: COST_MANAGEMENT_APP_ID,
        authentications: [],
        availability_status: status,
        availability_status_error: '',
        id: `cost-${numericId}`,
        paused_at: pausedAt,
      },
    ],
    authentications: [],
    availability_status: status,
    created_at: source.created_timestamp || source.created_at || null,
    endpoints: [],
    id,
    imported: null,
    last_available_at: null,
    last_checked_at: source.last_polling_time || source.last_payload_received_at || null,
    name: source.name,
    paused_at: pausedAt,
    source_ref: sourceRef,
    source_type_id: OPENSHIFT_SOURCE_TYPE_ID,
    updated_at: source.updated_timestamp || source.created_timestamp || null,
  };
};

// Koku's sources list has no OrderingFilter, so `ordering` does not change the payload.
const LIST_LIMIT = 1000;

const sortValue = (record, sortBy) => {
  if (!record) {
    return null;
  }
  if (sortBy === 'created_at') {
    const parsed = Date.parse(String(record.created_at || '').replace(' ', 'T'));
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (sortBy === 'name') {
    return record.name || '';
  }
  if (sortBy === 'source_type_id') {
    return record.source_type_id || '';
  }
  return null;
};

const comparePresent = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
};

const sortRecords = (records, sortBy, sortDirection) => {
  if (!sortBy) {
    return records;
  }
  const direction = sortDirection === 'desc' ? -1 : 1;
  return [...records].sort((leftRecord, rightRecord) => {
    const left = sortValue(leftRecord, sortBy);
    const right = sortValue(rightRecord, sortBy);
    if (left == null && right == null) {
      return 0;
    }
    if (left == null) {
      return 1;
    }
    if (right == null) {
      return -1;
    }
    return direction * comparePresent(left, right);
  });
};

const matchesFilters = (record, filterValue = {}) => {
  if (
    filterValue.name &&
    !String(record.name || '')
      .toLowerCase()
      .includes(String(filterValue.name).toLowerCase())
  ) {
    return false;
  }
  if (
    filterValue.source_type_id &&
    filterValue.source_type_id.length > 0 &&
    !filterValue.source_type_id.includes(record.source_type_id)
  ) {
    return false;
  }
  if (filterValue.applications && filterValue.applications.length > 0) {
    const ids = record.applications.map(app => app.application_type_id);
    if (!filterValue.applications.some(id => ids.includes(id))) {
      return false;
    }
  }
  const status = filterValue.availability_status && filterValue.availability_status[0];
  if (status === 'available' && record.availability_status !== 'available') {
    return false;
  }
  if (status === 'unavailable' && record.availability_status === 'available') {
    return false;
  }
  return true;
};

const toCostPatch = data => {
  const body = {};
  if (!data || typeof data !== 'object') {
    return body;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'name')) {
    body.name = data.name;
  }
  if (Object.prototype.hasOwnProperty.call(data, 'paused')) {
    body.paused = data.paused;
  }
  if (data.source_ref) {
    body.authentication = { credentials: { cluster_id: String(data.source_ref) } };
  }
  return body;
};

const createCostSourcesApi = http => {
  const sourcesCollection = `${COST_API}/sources/`;
  const sourceUrl = id => `${COST_API}/sources/${id}/`;

  const getOne = async id => {
    try {
      const body = await http.get(sourceUrl(id));
      return toSourcesRecord(body);
    } catch (error) {
      if (statusOf(error) === 404) {
        return null;
      }
      throw apiError(detailOf(error));
    }
  };

  const listCostSources = async ({ limit, offset, name } = {}) => {
    // The Cost list response is cached for an hour. A unique query keeps pause and
    // resume from being overwritten by that cached list.
    const params = { limit, offset, type: 'OCP', _: Date.now() };
    if (name) {
      params.name = name;
    }
    try {
      const body = await http.get(sourcesCollection, { params });
      const rows = rowsOf(body).filter(isOpenShift).map(toSourcesRecord);
      return { count: countOf(body, rows), rows };
    } catch (error) {
      throw apiError(detailOf(error));
    }
  };

  const listAllCostSources = async ({ name } = {}) => {
    const rows = [];
    const seen = new Set();
    let offset = 0;
    let count = Infinity;

    while (offset < count && rows.length < LIST_LIMIT) {
      const page = await listCostSources({ limit: LIST_LIMIT, name, offset });
      count = page.count;
      const fresh = page.rows.filter(row => {
        if (!row || seen.has(row.id)) {
          return false;
        }
        seen.add(row.id);
        return true;
      });
      if (fresh.length === 0) {
        break;
      }
      rows.push(...fresh);
      offset += page.rows.length;
    }

    return rows;
  };

  const doLoadEntities = async ({
    pageSize = 50,
    pageNumber = 1,
    sortBy,
    sortDirection,
    filterValue = {},
    activeCategory,
  } = {}) => {
    if (activeCategory === 'Cloud') {
      return { meta: { count: 0 }, sources: [] };
    }
    const loaded = await listAllCostSources({ name: filterValue.name });
    const filtered = loaded.filter(record => matchesFilters(record, filterValue));
    const sorted = sortRecords(filtered, sortBy, sortDirection);
    const start = (pageNumber - 1) * pageSize;
    return { meta: { count: sorted.length }, sources: sorted.slice(start, start + pageSize) };
  };

  const bulkCreate = async payload => {
    const source = (payload && payload.sources && payload.sources[0]) || {};
    const typeName = String(source.source_type_name || 'openshift').toLowerCase();
    if (typeName !== 'openshift' && typeName !== 'ocp') {
      throw apiError('Only OpenShift integrations can be created on-prem');
    }
    if (!source.name) {
      throw apiError('Name is required');
    }
    const clusterId = source.source_ref ? String(source.source_ref) : undefined;
    let created;
    try {
      created = await http.post(sourcesCollection, {
        name: source.name,
        source_type: 'OCP',
        ...(clusterId ? { authentication: { credentials: { cluster_id: clusterId } } } : {}),
      });
      try {
        await http.post(`${COST_API}/applications`, {
          application_type_id: 0,
          extra: clusterId ? { cluster_id: clusterId } : {},
          source_id: created.id,
        });
      } catch (appError) {
        if (created && created.uuid) {
          await http.delete(sourceUrl(created.uuid)).catch(() => undefined);
        }
        throw appError;
      }
    } catch (error) {
      throw apiError(detailOf(error));
    }
    const record = toSourcesRecord(created);
    const application = {
      ...record.applications[0],
      availability_status: 'available',
    };
    return {
      applications: [application],
      authentications: [],
      endpoints: [],
      sources: [record],
    };
  };

  const updateSource = async (id, data) => {
    const body = toCostPatch(data);
    if (Object.keys(body).length === 0) {
      return getOne(id);
    }
    try {
      const updated = await http.patch(sourceUrl(id), body);
      return toSourcesRecord(updated);
    } catch (error) {
      throw apiError(detailOf(error));
    }
  };

  const setPaused = async (id, paused) => {
    try {
      const updated = await http.patch(sourceUrl(id), { paused });
      return toSourcesRecord(updated);
    } catch (error) {
      throw apiError(detailOf(error));
    }
  };

  const deleteSource = async id => {
    try {
      await http.delete(sourceUrl(id));
    } catch (error) {
      throw apiError(detailOf(error));
    }
  };

  const availableRecord = id => ({
    availability_status: 'available',
    availability_status_error: '',
    id,
    last_checked_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const unsupported = name => () =>
    Promise.reject(apiError(`${name} is not available for on-prem Cost Management sources`));

  const postGraphQL = async ({ query = '' } = {}) => {
    const idMatch = query.match(/name:\s*"id"[\s\S]*?value:\s*"([^"]*)"/);
    if (idMatch) {
      const record = await getOne(idMatch[1]);
      return { data: { meta: { count: record ? 1 : 0 }, sources: record ? [record] : [] } };
    }
    const nameMatch = query.match(/name:\s*"name"[\s\S]*?value:\s*"([^"]*)"/);
    if (nameMatch && !query.includes('contains_i')) {
      const loaded = await listCostSources({ limit: 50, name: nameMatch[1], offset: 0 });
      const sources = loaded.rows.filter(record => record.name === nameMatch[1]);
      return { data: { sources } };
    }
    const listed = await doLoadEntities();
    return { data: listed };
  };

  const getSourcesApi = () => ({
    bulkCreate,
    checkAvailabilitySource: async id => {
      const record = await getOne(id);
      if (!record) {
        throw apiError('Requested source was not found');
      }
      return record;
    },
    createApplication: unsupported('createApplication'),
    createAuthApp: unsupported('createAuthApp'),
    createAuthentication: unsupported('createAuthentication'),
    createEndpoint: unsupported('createEndpoint'),
    createSource: data => bulkCreate({ sources: [data] }),
    deleteApplication: unsupported('deleteApplication'),
    deleteAuthentication: unsupported('deleteAuthentication'),
    deleteSource,
    doLoadAppTypes: () => Promise.resolve({ data: [costApplicationType] }),
    getEndpoint: id => Promise.resolve(availableRecord(id)),
    getGoogleAccount: unsupported('getGoogleAccount'),
    getLighthouseLink: unsupported('getLighthouseLink'),
    getProvAppType: unsupported('getProvAppType'),
    getProvMetadata: unsupported('getProvMetadata'),
    getProvisioningServiceAccount: unsupported('getProvisioningServiceAccount'),
    listEndpointAuthentications: () => Promise.resolve({ data: [] }),
    listSourceApplications: () => Promise.resolve({ data: [] }),
    listSourceAuthentications: () => Promise.resolve({ data: [] }),
    listSourceEndpoints: () => Promise.resolve({ data: [] }),
    listSourceTypes: () => Promise.resolve({ data: [openshiftSourceType] }),
    pauseApplication: unsupported('pauseApplication'),
    pauseSource: id => setPaused(id, true),
    postGraphQL,
    showApplication: id => Promise.resolve(availableRecord(id)),
    showAuthentication: unsupported('showAuthentication'),
    showSource: async id => {
      const record = await getOne(id);
      if (!record) {
        throw apiError('Requested source was not found');
      }
      return record;
    },
    unpauseApplication: unsupported('unpauseApplication'),
    unpauseSource: id => setPaused(id, false),
    updateApplication: unsupported('updateApplication'),
    updateAuthentication: unsupported('updateAuthentication'),
    updateEndpoint: unsupported('updateEndpoint'),
    updateSource,
  });

  const doLoadSource = async id => {
    const record = await getOne(id);
    return { sources: record ? [record] : [] };
  };

  const doLoadApplicationsForEdit = async id => {
    const record = await getOne(id);
    return { sources: [{ applications: (record && record.applications) || [] }] };
  };

  const doRemoveSource = sourceId =>
    getSourcesApi()
      .deleteSource(sourceId)
      .catch(error => {
        throw apiError(detailOf(error));
      });

  const doDeleteApplication = (appId, errorMessage) =>
    getSourcesApi()
      .deleteApplication(appId)
      .catch(error => {
        const wrapped = apiError(detailOf(error));
        wrapped.error = { detail: wrapped.detail, title: errorMessage };
        throw wrapped;
      });

  const doCreateApplication = data => getSourcesApi().createApplication(data);
  const doLoadAppTypes = () => getSourcesApi().doLoadAppTypes();

  const getCostApi = () => ({
    listAwsRegions: (limit = 10000, offset = 0) =>
      http.get(`${COST_API}/sources/aws-s3-regions/`, { params: { limit, offset } }),
  });

  return {
    COST_MANAGEMENT_APP_ID,
    OPENSHIFT_SOURCE_TYPE_ID,
    costApplicationType,
    createCostSourcesApi,
    doCreateApplication,
    doDeleteApplication,
    doLoadAppTypes,
    doLoadApplicationsForEdit,
    doLoadEntities,
    doLoadSource,
    doRemoveSource,
    getCostApi,
    getSourcesApi,
    openshiftSourceType,
    toSourcesRecord,
  };
};

const CLOUD_VENDOR = 'Cloud';
const REDHAT_VENDOR = 'Red Hat';
const AVAILABLE = 'available';
const UNAVAILABLE = 'unavailable';
const PARTIALLY_UNAVAILABLE = 'partially_available';

const restFilterGenerator = (filterValue = {}, category) => {
  const filterQueries = [];
  if (filterValue.name) {
    filterQueries.push(`filter[name][contains_i]=${filterValue.name}`);
  }
  if (filterValue.source_type_id && filterValue.source_type_id.length > 0) {
    filterValue.source_type_id.forEach(id => filterQueries.push(`filter[source_type_id][]=${id}`));
  }
  if (filterValue.applications && filterValue.applications.length > 0) {
    filterValue.applications.forEach(id => filterQueries.push(`filter[applications][application_type_id][eq][]=${id}`));
  }
  if (category === CLOUD_VENDOR) {
    filterQueries.push('filter[source_type][category]=Cloud');
  }
  if (category === REDHAT_VENDOR) {
    filterQueries.push('filter[source_type][category]=Red Hat');
  }
  const status = filterValue.availability_status && filterValue.availability_status[0];
  if (status === AVAILABLE) {
    filterQueries.push(`filter[availability_status]=${AVAILABLE}`);
  } else if (status === UNAVAILABLE) {
    filterQueries.push(`filter[availability_status][]=${PARTIALLY_UNAVAILABLE}`);
    filterQueries.push(`filter[availability_status][]=${UNAVAILABLE}`);
  }
  return filterQueries.join('&');
};

module.exports = {
  COST_MANAGEMENT_APP_ID,
  OPENSHIFT_SOURCE_TYPE_ID,
  availabilityStatus,
  createCostSourcesApi,
  restFilterGenerator,
  toSourcesRecord,
};
