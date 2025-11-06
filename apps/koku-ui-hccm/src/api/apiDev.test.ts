// Top-level axios mock with shared state
let mockAxiosInstance: any = {
  get: jest.fn(),
  interceptors: { request: { use: jest.fn() } },
};
let mockCreate = jest.fn(() => mockAxiosInstance);

jest.mock('axios', () => ({ __esModule: true, default: { create: (...args: unknown[]) => (mockCreate as any)(...args) } }));

function setInsightsMock({ token }: { token?: string | null } = {}) {
  (window as any).insights = {
    chrome: {
      auth: {
        getToken: () => (token === undefined ? null : Promise.resolve(token)),
      },
    },
  };
}

describe('apiDev axiosInstance', () => {
  const loadModule = () => {
    const state: any = {};
    jest.isolateModules(() => {
      // Re-require module under test to invoke axios.create and register interceptor
      const exported = require('./apiDev');
      state.axiosInstance = exported.default as any;
    });
    return state as { axiosInstance: any };
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Fresh axios instance each test
    mockAxiosInstance = { get: jest.fn(), interceptors: { request: { use: jest.fn() } } };
    mockCreate = jest.fn(() => mockAxiosInstance);
  });

  test('registers request interceptor', () => {
    loadModule();
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  test('devAuthInterceptor returns undefined when no promise (mock env)', async () => {
    setInsightsMock({ token: undefined });
    loadModule();
    const interceptor = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const result = interceptor({ headers: { Foo: 'Bar' } } as any);
    expect(result).toBeUndefined();
  });

  test('devAuthInterceptor resolves with Authorization header when token provided', async () => {
    setInsightsMock({ token: 'abc123' });
    loadModule();
    const interceptor = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
    const result = await interceptor({ headers: { Foo: 'Bar' } } as any);
    expect(result.headers.Authorization).toEqual('Bearer abc123');
    expect(result.headers.Accept).toEqual('application/json');
    expect(result.headers.Foo).toEqual('Bar');
  });

  test('devAxiosInstance proxies get', () => {
    const { axiosInstance } = loadModule();
    axiosInstance.get('/ping');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/ping');
  });
}); 