describe('api axiosInstance', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const mockAxiosModule = () => {
    const interceptors = { request: { use: jest.fn() } };
    const instance = { get: jest.fn(), interceptors } as any;
    const create = jest.fn(() => instance);
    jest.doMock('axios', () => ({ __esModule: true, default: { create } }));
    return { instance, create };
  };

  const loadModule = () => {
    const state: any = {};
    jest.isolateModules(() => {
      const { instance, create } = mockAxiosModule();
      const exported = require('./api');
      state.axiosInstance = exported.default as any;
      state.instance = instance;
      state.create = create;
    });
    return state as { axiosInstance: any; instance: any; create: jest.Mock };
  };

  test('sets Cache-Control: no-cache header to prevent browser HTTP caching', () => {
    const { create } = loadModule();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Cache-Control': 'no-cache',
        }),
      })
    );
  });

  test('proxies get calls to axios instance', () => {
    const { axiosInstance, instance } = loadModule();
    axiosInstance.get('/test');
    expect(instance.get).toHaveBeenCalledWith('/test');
  });
}); 