import mockAxios from 'axios';

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

  test('registers request interceptor', () => {
    const { instance } = loadModule();
    expect(instance.interceptors.request.use).toHaveBeenCalledTimes(1);
    const interceptor = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    expect(typeof interceptor).toBe('function');
  });

  test('authInterceptor preserves headers', () => {
    const { instance } = loadModule();
    const interceptor = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const config = { headers: { Foo: 'Bar' } } as any;
    const result = interceptor(config);
    expect(result).toEqual({ ...config, headers: { Foo: 'Bar' } });
  });

  test('authInterceptor handles missing headers', () => {
    const { instance } = loadModule();
    const interceptor = (instance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const result = interceptor({} as any);
    expect(result.headers).toEqual({});
  });

  test('proxies get calls to axios instance', () => {
    const { axiosInstance, instance } = loadModule();
    axiosInstance.get('/test');
    expect(instance.get).toHaveBeenCalledWith('/test');
  });
}); 