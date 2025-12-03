import { fetchSources } from './api';

jest.mock('@koku-ui/api/providers', () => ({
  __esModule: true,
  fetchProviders: jest.fn(() =>
    Promise.resolve({
      data: {
        data: [
          { name: 'src-1', uuid: 'u1', cost_models: [{ name: 'cm-a' }] },
          { name: 'src-2', uuid: 'u2', cost_models: [] },
        ],
        meta: { count: 2 },
      },
    })
  ),
}));

const { fetchProviders } = require('@koku-ui/api/providers');

describe('costModelWizard/api fetchSources', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('builds query with type, limit, offset and maps payload', async () => {
    const query = { search: 'x' } as any;
    const res = await fetchSources({ type: 'AWS', page: 2, perPage: 5, query });
    expect(fetchProviders).toHaveBeenCalledWith('type=AWS&limit=5&offset=5&search=x');
    expect(res).toEqual([
      { name: 'src-1', uuid: 'u1', costmodel: 'cm-a', meta: { count: 2 } },
      { name: 'src-2', uuid: 'u2', costmodel: '', meta: { count: 2 } },
    ]);
  });

  test('handles different provider type and pagination params', async () => {
    await fetchSources({ type: 'OCP', page: 1, perPage: 10, query: { q: 'y' } as any });
    expect(fetchProviders).toHaveBeenCalledWith('type=OCP&limit=10&offset=0&q=y');
  });
}); 