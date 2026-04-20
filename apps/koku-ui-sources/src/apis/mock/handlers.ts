import { http, HttpResponse } from 'msw';

import { APPLICATIONS_PATH } from '../applications-service';
import { SOURCES_PATH } from '../sources-service';
import { mockSources } from './data/sources';

let sources = [...mockSources];
let nextId = sources.length + 1;

export const handlers = [
  http.get(SOURCES_PATH + '/', ({ request }) => {
    const url = new URL(request.url);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10);
    const nameFilter = url.searchParams.get('name');

    let filtered = [...sources];
    if (nameFilter) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    const page = filtered.slice(offset, offset + limit);
    return HttpResponse.json({
      meta: { count: filtered.length },
      links: { first: '', next: null, previous: null, last: '' },
      data: page,
    });
  }),

  http.get(SOURCES_PATH + '/:uuid/', ({ params }) => {
    const source = sources.find(s => s.uuid === params.uuid);
    if (!source) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(source);
  }),

  http.post(SOURCES_PATH + '/', async ({ request }) => {
    const body = (await request.json()) as any;
    const newSource: any = {
      id: nextId++,
      uuid: crypto.randomUUID(),
      name: body.name,
      source_type: body.source_type,
      authentication: {},
      billing_source: null,
      provider_linked: false,
      active: false,
      paused: false,
      current_month_data: false,
      previous_month_data: false,
      has_data: false,
      created_timestamp: new Date().toISOString(),
    };
    sources.push(newSource);
    return HttpResponse.json(newSource, { status: 201 });
  }),

  http.patch(SOURCES_PATH + '/:uuid/', async ({ params, request }) => {
    const body = (await request.json()) as any;
    const idx = sources.findIndex(s => s.uuid === params.uuid);
    if (idx === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    sources[idx] = { ...sources[idx], ...body };
    return HttpResponse.json(sources[idx]);
  }),

  http.delete(SOURCES_PATH + '/:uuid/', ({ params }) => {
    sources = sources.filter(s => s.uuid !== params.uuid);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(APPLICATIONS_PATH, async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json(
      { id: nextId++, source_id: body.source_id, application_type_id: body.application_type_id, extra: body.extra },
      { status: 201 }
    );
  }),
];
