import { createAxiosInstance } from '@koku-ui/ui-lib/api';

import { fetchUserPermissions } from './api';

jest.mock('@koku-ui/ui-lib/api', () => ({
  createAxiosInstance: jest.fn(),
}));

describe('fetchUserPermissions', () => {
  const get = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (createAxiosInstance as jest.Mock).mockReturnValue({ get });
  });

  it('fetches all pages from /api/rbac/v1/access/', async () => {
    get
      .mockResolvedValueOnce({
        data: {
          data: [{ permission: 'rbac:role:read', resourceDefinitions: [] }],
          meta: { count: 2, limit: 1, offset: 0 },
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [{ permission: 'rbac:group:read', resourceDefinitions: [] }],
          meta: { count: 2, limit: 1, offset: 1 },
        },
      });

    await expect(fetchUserPermissions('rbac')).resolves.toEqual([
      { permission: 'rbac:role:read', resourceDefinitions: [] },
      { permission: 'rbac:group:read', resourceDefinitions: [] },
    ]);

    expect(get).toHaveBeenNthCalledWith(1, '/api/rbac/v1/access/', {
      params: { application: 'rbac', limit: 1000, offset: 0 },
    });
    expect(get).toHaveBeenNthCalledWith(2, '/api/rbac/v1/access/', {
      params: { application: 'rbac', limit: 1000, offset: 1 },
    });
  });
});
