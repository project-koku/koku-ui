/**
 * Mutable store + Cypress intercepts for Sources (Integrations) UI tests.
 * Register with {@link registerSourcesIntegrationApi} after {@link cy.loadApiInterceptors}.
 */

export interface MockSourceRow {
  id: number;
  uuid: string;
  name: string;
  source_type: string;
  authentication: Record<string, unknown>;
  billing_source: Record<string, unknown> | null;
  provider_linked: boolean;
  active: boolean;
  paused: boolean;
  current_month_data: boolean;
  previous_month_data: boolean;
  has_data: boolean;
  created_timestamp: string;
  cost_models: unknown[];
  infrastructure: Record<string, unknown>;
  additional_context: Record<string, unknown>;
}

export interface SourcesIntegrationStore {
  rows: MockSourceRow[];
}

function linksFor(count: number, limit: number, offset: number) {
  const base = '/api/cost-management/v1/sources/';
  const qs = (o: number, l: number) => `?limit=${l}&offset=${o}`;
  return {
    first: `${base}${qs(0, limit)}`,
    next: offset + limit < count ? `${base}${qs(offset + limit, limit)}` : null,
    previous: offset > 0 ? `${base}${qs(Math.max(0, offset - limit), limit)}` : null,
    last: `${base}${qs(Math.max(0, Math.floor((count - 1) / limit) * limit), limit)}`,
  };
}

function applyNameTypeFilters(rows: MockSourceRow[], params: URLSearchParams) {
  let out = [...rows];
  const name = params.get('name');
  const type = params.get('type');
  if (name && params.has('offset')) {
    const n = name.toLowerCase();
    out = out.filter(r => r.name.toLowerCase().includes(n));
  }
  if (type) {
    out = out.filter(r => r.source_type === type);
  }
  return out;
}

function applyOrdering(rows: MockSourceRow[], ordering: string | null) {
  if (!ordering) {
    return rows;
  }
  const desc = ordering.startsWith('-');
  const key = (desc ? ordering.slice(1) : ordering) as keyof MockSourceRow;
  const mul = desc ? -1 : 1;
  return [...rows].sort((a, b) => {
    let av: string | number | boolean = a[key] as string | number | boolean;
    let bv: string | number | boolean = b[key] as string | number | boolean;
    if (key === 'created_timestamp') {
      av = new Date(String(av)).getTime();
      bv = new Date(String(bv)).getTime();
    }
    if (typeof av === 'boolean') {
      av = av ? 1 : 0;
    }
    if (typeof bv === 'boolean') {
      bv = bv ? 1 : 0;
    }
    if (av < bv) {
      return -1 * mul;
    }
    if (av > bv) {
      return 1 * mul;
    }
    return 0;
  });
}

export function makeMockSource(
  partial: Partial<MockSourceRow> & Pick<MockSourceRow, 'id' | 'uuid' | 'name'>
): MockSourceRow {
  return {
    source_type: 'OCP',
    authentication: { credentials: { cluster_id: 'test-cluster' } },
    billing_source: null,
    provider_linked: true,
    active: true,
    paused: false,
    current_month_data: true,
    previous_month_data: true,
    has_data: true,
    created_timestamp: '2026-03-01T12:00:00Z',
    cost_models: [],
    infrastructure: {},
    additional_context: {},
    ...partial,
  };
}

/**
 * Dynamic Sources + Applications API. Call after cy.loadApiInterceptors() so these routes win.
 */
export function registerSourcesIntegrationApi(store: SourcesIntegrationStore) {
  cy.intercept({ url: /\/api\/cost-management\/v1\/sources/i }, req => {
    const url = new URL(req.url, window.location.origin);
    const pathname = url.pathname.replace(/\/$/, '');
    const uuidMatch = pathname.match(/\/sources\/([0-9a-f-]{36})$/i);

    if (req.method === 'GET' && uuidMatch) {
      const uuid = uuidMatch[1];
      const found = store.rows.find(r => r.uuid === uuid);
      if (found) {
        req.reply({ statusCode: 200, body: found });
      } else {
        req.reply({ statusCode: 404, body: {} });
      }
      return;
    }

    if (req.method === 'GET') {
      const params = url.searchParams;
      const isDuplicateNameCheck = params.has('name') && !params.has('offset');

      if (isDuplicateNameCheck) {
        const want = params.get('name')!.toLowerCase();
        const matches = store.rows.filter(r => r.name.toLowerCase() === want);
        req.reply({
          statusCode: 200,
          body: { data: matches, meta: { count: matches.length }, links: linksFor(matches.length, 10, 0) },
        });
        return;
      }

      let working = applyNameTypeFilters(store.rows, params);
      const ordering = params.get('ordering');
      working = applyOrdering(working, ordering);

      const limit = parseInt(params.get('limit') || '10', 10);
      const offset = parseInt(params.get('offset') || '0', 10);
      const total = working.length;
      const pageRows = limit >= 1000 ? working : working.slice(offset, offset + limit);

      req.reply({
        statusCode: 200,
        body: {
          data: pageRows,
          meta: { count: total },
          links: linksFor(total, limit, offset),
        },
      });
      return;
    }

    if (req.method === 'POST') {
      const rawBody = req.body as Record<string, unknown> | string;
      const body = typeof rawBody === 'string' ? (JSON.parse(rawBody || '{}') as Record<string, unknown>) : rawBody;
      const maxId = store.rows.length > 0 ? Math.max(...store.rows.map(r => r.id)) : 0;
      const newId = maxId + 1;
      const uuid = `10000000-0000-4000-8000-${String(newId).padStart(12, '0')}`;
      const row: MockSourceRow = makeMockSource({
        id: newId,
        uuid,
        name: String(body.name),
        source_type: String(body.source_type || 'OCP'),
        authentication: (body.authentication as Record<string, unknown>) || {},
        billing_source: null,
        active: true,
        paused: false,
        current_month_data: false,
        previous_month_data: false,
        has_data: false,
        created_timestamp: new Date().toISOString(),
      });
      store.rows.push(row);
      req.reply({ statusCode: 201, body: row });
      return;
    }

    if (req.method === 'DELETE' && uuidMatch) {
      const uuid = uuidMatch[1];
      store.rows = store.rows.filter(r => r.uuid !== uuid);
      req.reply({ statusCode: 204, body: '' });
      return;
    }

    if (req.method === 'PATCH' && uuidMatch) {
      const uuid = uuidMatch[1];
      const rawBody = req.body as Record<string, unknown> | string;
      const body = typeof rawBody === 'string' ? (JSON.parse(rawBody || '{}') as Record<string, unknown>) : rawBody;

      const idx = store.rows.findIndex(r => r.uuid === uuid);
      if (idx < 0) {
        req.reply({ statusCode: 404, body: {} });
        return;
      }
      const cur = { ...store.rows[idx] };
      if (typeof body.name === 'string') {
        cur.name = body.name;
      }
      if (typeof body.paused === 'boolean') {
        cur.paused = body.paused;
      }
      store.rows[idx] = cur;
      req.reply({ statusCode: 200, body: cur });
      return;
    }

    req.reply({ statusCode: 500, body: { detail: 'unhandled sources mock' } });
  }).as('sourcesIntegrationApi');

  cy.intercept({ method: 'POST', url: /\/api\/cost-management\/v1\/applications\/?$/i }, req => {
    const b = req.body as { source_id?: number };
    req.reply({
      statusCode: 201,
      body: {
        id: 900000 + Math.floor(Math.random() * 100000),
        source_id: b.source_id ?? 0,
        application_type_id: 0,
        extra: {},
      },
    });
  }).as('applicationsCreate');
}
