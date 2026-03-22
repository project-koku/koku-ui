import axios from 'axios';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  };
  return {
    __esModule: true,
    default: { create: jest.fn(() => instance) },
    create: jest.fn(() => instance),
  };
});

describe('sources axios instance', () => {
  test('sets Cache-Control: no-cache header to prevent browser HTTP caching', () => {
    jest.isolateModules(() => {
      require('./api');
    });
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Cache-Control': 'no-cache',
        }),
      })
    );
  });
});
