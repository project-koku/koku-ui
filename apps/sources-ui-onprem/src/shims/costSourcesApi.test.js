const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { createCostSourcesApi, toSourcesRecord } = require('./costSourcesApi');

const costSource = {
  created_timestamp: '2025-10-02 09:58:30',
  id: '807608',
  name: 'OCP on OpenStack - Nise populator',
  paused: false,
  source_ref: 'a94ea9bc-9e4f-4b91-89c2-c7099ec08427',
  source_type: 'OCP',
  status: {
    download: { state: 'complete' },
    processing: { state: 'complete' },
    summary: { state: 'complete' },
  },
  uuid: '021ca3a6-7c82-493f-bb27-8ca9a7a2e46c',
};

const httpError = (status, detail) => {
  const error = new Error(detail);
  error.response = { data: { detail }, status };
  return error;
};

describe('toSourcesRecord', () => {
  it('copies Cost fields into the Sources record and invents the rest', () => {
    const record = toSourcesRecord(costSource);

    assert.equal(record.id, costSource.uuid);
    assert.equal(record.name, costSource.name);
    assert.equal(record.source_ref, costSource.source_ref);
    assert.equal(record.created_at, costSource.created_timestamp);
    assert.equal(record.source_type_id, '5');
    assert.equal(record.paused_at, null);
    assert.equal(record.last_checked_at, null);
    assert.equal(record.availability_status, 'available');
    assert.equal(record.applications[0].id, 'cost-807608');
    assert.equal(record.applications[0].application_type_id, '2');
    assert.equal(record.applications[0].availability_status, 'available');
    assert.deepEqual(record.endpoints, []);
    assert.deepEqual(record.authentications, []);
  });

  it('uses Cost last_polling_time as the last availability check', () => {
    const record = toSourcesRecord({ ...costSource, last_polling_time: '2026-02-01 14:45:00' });

    assert.equal(record.last_checked_at, '2026-02-01 14:45:00');
  });

  it('treats a paused source as paused and unavailable', () => {
    const record = toSourcesRecord({ ...costSource, paused: true });

    assert.equal(record.paused_at, costSource.created_timestamp);
    assert.equal(record.availability_status, 'unavailable');
    assert.equal(record.applications[0].paused_at, costSource.created_timestamp);
  });

  it('marks incomplete Cost status unavailable', () => {
    const record = toSourcesRecord({
      ...costSource,
      status: {
        download: { state: 'complete' },
        processing: { state: 'failed' },
        summary: { state: 'complete' },
      },
    });

    assert.equal(record.availability_status, 'unavailable');
    assert.equal(record.paused_at, null);
  });

  it('treats an active source with no report status as available', () => {
    const record = toSourcesRecord({ ...costSource, active: true, status: null });

    assert.equal(record.availability_status, 'available');
    assert.equal(record.applications[0].availability_status, 'available');
  });

  it('treats an inactive source as unavailable even when processing is complete', () => {
    const record = toSourcesRecord({ ...costSource, active: false });

    assert.equal(record.availability_status, 'unavailable');
    assert.equal(record.paused_at, null);
  });
});

describe('cost sources api', () => {
  const calls = [];
  const sources = [costSource];

  const http = {
    delete: async url => {
      calls.push({ url, method: 'DELETE' });
    },
    get: async (url, config) => {
      calls.push({ config, method: 'GET', url });
      if (url.endsWith('/aws-s3-regions/')) {
        return { data: ['us-east-1'] };
      }
      if (url.endsWith('/sources/')) {
        const name = config && config.params && config.params.name;
        const data = name ? sources.filter(source => source.name.includes(name)) : sources;
        return { data, meta: { count: data.length } };
      }
      const uuid = url.split('/').filter(Boolean).pop();
      const found = sources.find(source => source.uuid === uuid);
      if (!found) {
        throw httpError(404, 'not found');
      }
      return found;
    },
    patch: async (url, body) => {
      calls.push({ body, method: 'PATCH', url });
      const uuid = url.split('/').filter(Boolean).pop();
      const found = sources.find(source => source.uuid === uuid);
      return { ...found, ...body, paused: body.paused != null ? body.paused : found.paused };
    },
    post: async (url, body) => {
      calls.push({ body, method: 'POST', url });
      if (url.endsWith('/applications')) {
        if (body && body.source_id === 'fail-app') {
          throw httpError(400, 'application failed');
        }
        return { id: 1 };
      }
      return {
        ...costSource,
        id: body && body.name === 'Broken' ? 'fail-app' : '900',
        name: body.name,
        source_ref: body.authentication && body.authentication.credentials.cluster_id,
        uuid: 'new-uuid',
      };
    },
  };

  const api = createCostSourcesApi(http);
  const sourcesApi = api.getSourcesApi();

  it('lists OpenShift sources with Cost query params', async () => {
    calls.length = 0;
    const listed = await api.doLoadEntities({
      filterValue: { name: 'Nise' },
      pageNumber: 1,
      pageSize: 50,
      sortBy: 'created_at',
      sortDirection: 'desc',
    });

    assert.equal(listed.sources[0].id, costSource.uuid);
    assert.equal(listed.meta.count, 1);
    assert.equal(typeof calls[0].config.params._, 'number');
    const { _, ...params } = calls[0].config.params;
    assert.deepEqual(params, {
      limit: 1000,
      name: 'Nise',
      offset: 0,
      type: 'OCP',
    });
  });

  it('sorts and pages the list because the Cost API ignores ordering', async () => {
    const older = {
      ...costSource,
      created_timestamp: '2024-01-01 00:00:00',
      id: '1',
      name: 'Zebra',
      uuid: 'older',
    };
    const newer = {
      ...costSource,
      created_timestamp: '2026-01-01 00:00:00',
      id: '2',
      name: 'Alpha',
      uuid: 'newer',
    };
    const localApi = createCostSourcesApi({
      get: async url => {
        if (String(url).endsWith('/sources/')) {
          return { data: [older, newer], meta: { count: 2 } };
        }
        throw httpError(404, 'not found');
      },
    });

    const byName = await localApi.doLoadEntities({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'name',
      sortDirection: 'asc',
    });
    assert.deepEqual(
      byName.sources.map(source => source.name),
      ['Alpha', 'Zebra']
    );

    const byDate = await localApi.doLoadEntities({
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortDirection: 'desc',
    });
    assert.deepEqual(
      byDate.sources.map(source => source.name),
      ['Alpha', 'Zebra']
    );

    const secondPage = await localApi.doLoadEntities({
      pageNumber: 2,
      pageSize: 1,
      sortBy: 'name',
      sortDirection: 'desc',
    });
    assert.equal(secondPage.meta.count, 2);
    assert.deepEqual(
      secondPage.sources.map(source => source.name),
      ['Alpha']
    );
  });

  it('returns an empty catalog for the Cloud category', async () => {
    const listed = await api.doLoadEntities({ activeCategory: 'Cloud' });
    assert.deepEqual(listed, { meta: { count: 0 }, sources: [] });
  });

  it('loads one source by the uuid stored in id', async () => {
    const loaded = await api.doLoadSource(costSource.uuid);
    assert.equal(loaded.sources[0].name, costSource.name);
  });

  it('renames with a Cost name patch', async () => {
    calls.length = 0;
    await sourcesApi.updateSource(costSource.uuid, { name: 'Renamed' });
    assert.equal(calls[0].method, 'PATCH');
    assert.equal(calls[0].url, `/api/cost-management/v1/sources/${costSource.uuid}/`);
    assert.deepEqual(calls[0].body, { name: 'Renamed' });
  });

  it('checks availability by reloading the Cost source', async () => {
    calls.length = 0;
    const record = await sourcesApi.checkAvailabilitySource(costSource.uuid);

    assert.equal(calls[0].method, 'GET');
    assert.equal(calls[0].url, `/api/cost-management/v1/sources/${costSource.uuid}/`);
    assert.equal(record.id, costSource.uuid);
  });

  it('pauses and resumes with the Cost paused boolean', async () => {
    calls.length = 0;
    await sourcesApi.pauseSource(costSource.uuid);
    await sourcesApi.unpauseSource(costSource.uuid);
    assert.deepEqual(calls[0].body, { paused: true });
    assert.deepEqual(calls[1].body, { paused: false });
  });

  it('deletes by uuid', async () => {
    calls.length = 0;
    await sourcesApi.deleteSource(costSource.uuid);
    assert.equal(calls[0].method, 'DELETE');
    assert.equal(calls[0].url, `/api/cost-management/v1/sources/${costSource.uuid}/`);
  });

  it('creates OpenShift from a bulk_create body and attaches the Cost application', async () => {
    calls.length = 0;
    const created = await sourcesApi.bulkCreate({
      applications: [{ application_type_id: '2' }],
      authentications: [{ authtype: 'token' }],
      endpoints: [],
      sources: [{ name: 'My New Source', source_ref: 'abc-123', source_type_name: 'openshift' }],
    });

    assert.equal(calls[0].url, '/api/cost-management/v1/sources/');
    assert.deepEqual(calls[0].body, {
      authentication: { credentials: { cluster_id: 'abc-123' } },
      name: 'My New Source',
      source_type: 'OCP',
    });
    assert.equal(calls[1].url, '/api/cost-management/v1/applications');
    assert.deepEqual(calls[1].body, {
      application_type_id: 0,
      extra: { cluster_id: 'abc-123' },
      source_id: '900',
    });
    assert.equal(created.sources[0].id, 'new-uuid');
    assert.equal(created.applications[0].availability_status, 'available');
    assert.deepEqual(created.endpoints, []);
    assert.deepEqual(created.authentications, []);
  });

  it('deletes the new source when the application post fails', async () => {
    calls.length = 0;
    await assert.rejects(
      sourcesApi.bulkCreate({
        sources: [{ name: 'Broken', source_ref: 'abc-123', source_type_name: 'openshift' }],
      }),
      error => error.errors[0].detail === 'application failed'
    );
    assert.equal(calls[2].method, 'DELETE');
    assert.equal(calls[2].url, '/api/cost-management/v1/sources/new-uuid/');
  });

  it('finds a source by name through the GraphQL-shaped response', async () => {
    const response = await sourcesApi.postGraphQL({
      query: '{ sources(filter: {name: "name", value: "OCP on OpenStack - Nise populator"}) { id, name } }',
    });
    assert.equal(response.data.sources[0].id, costSource.uuid);
  });

  it('serves the static OpenShift type and Cost Management application type', async () => {
    const sourceTypes = await sourcesApi.listSourceTypes();
    const appTypes = await api.doLoadAppTypes();
    assert.equal(sourceTypes.data[0].id, '5');
    assert.equal(sourceTypes.data[0].name, 'openshift');
    assert.equal(sourceTypes.data[0].schema.authentication[0].type, 'token');
    assert.deepEqual(
      sourceTypes.data[0].schema.authentication[0].fields.map(field => field.name),
      ['source.source_ref']
    );
    assert.equal(appTypes.data[0].id, '2');
    assert.deepEqual(appTypes.data[0].supported_source_types, ['openshift']);
  });
});
