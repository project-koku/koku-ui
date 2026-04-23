import { axiosInstance } from './axios-client';
import { SourcesService } from './sources-service';

jest.mock('./axios-client', () => ({
  __esModule: true,
  API_BASE: '/api/cost-management/v1',
  axiosInstance: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedAxios = jest.mocked(axiosInstance);

describe('SourcesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listSources', () => {
    it('calls axios.get with correct URL and empty params by default', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
        links: { first: '', next: null, previous: null, last: '' },
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      await SourcesService.listSources();

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: {},
      });
    });

    it('includes params when provided', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
        links: { first: '', next: null, previous: null, last: '' },
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      await SourcesService.listSources({ name: 'test' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { name: 'test' },
      });
    });

    it('passes ordering for ascending sort', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
        links: { first: '', next: null, previous: null, last: '' },
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      await SourcesService.listSources({ ordering: 'name' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { ordering: 'name' },
      });
    });

    it('passes ordering for descending sort', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
        links: { first: '', next: null, previous: null, last: '' },
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      await SourcesService.listSources({ ordering: '-created_timestamp' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { ordering: '-created_timestamp' },
      });
    });
  });

  describe('getSource', () => {
    it('calls axios.get with correct URL for uuid', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test' };
      mockedAxios.get.mockResolvedValue({ data: mockSource });

      const result = await SourcesService.getSource('uuid-1');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/uuid-1/');
      expect(result).toEqual(mockSource);
    });
  });

  describe('createSource', () => {
    it('calls axios.post with correct data', async () => {
      const createData = { name: 'x', source_type: 'OCP' };
      const mockSource = { id: 1, uuid: 'uuid-1', ...createData };
      mockedAxios.post.mockResolvedValue({ data: mockSource });

      const result = await SourcesService.createSource(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cost-management/v1/sources/', createData);
      expect(result).toEqual(mockSource);
    });

    it('includes authentication and billing_source when provided', async () => {
      const createData = {
        name: 'ocp',
        source_type: 'OCP',
        authentication: { credentials: { cluster_id: 'cid-1' } },
        billing_source: { data_source: { bucket: 'b' } },
      };
      mockedAxios.post.mockResolvedValue({ data: { id: 2, uuid: 'u2' } });

      await SourcesService.createSource(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cost-management/v1/sources/', createData);
    });
  });

  describe('updateSource', () => {
    it('calls axios.patch with correct URL and data', async () => {
      const updateData = { name: 'new' };
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'new' };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await SourcesService.updateSource('uuid-1', updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/cost-management/v1/sources/uuid-1/', updateData);
      expect(result).toEqual(mockSource);
    });
  });

  describe('deleteSource', () => {
    it('calls axios.delete with correct URL', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await SourcesService.deleteSource('uuid-1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/cost-management/v1/sources/uuid-1/');
    });
  });

  describe('pauseSource', () => {
    it('calls axios.patch with only paused: true', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test', source_type: 'OCP', paused: true };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await SourcesService.pauseSource({ uuid: 'uuid-1' });

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/cost-management/v1/sources/uuid-1/', {
        paused: true,
      });
      expect(result).toEqual(mockSource);
    });
  });

  describe('resumeSource', () => {
    it('calls axios.patch with only paused: false', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test', source_type: 'OCP', paused: false };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await SourcesService.resumeSource({ uuid: 'uuid-1' });

      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/cost-management/v1/sources/uuid-1/', {
        paused: false,
      });
      expect(result).toEqual(mockSource);
    });
  });

  describe('findSourceByName', () => {
    it('calls listSources with the name param', async () => {
      const mockResponse = {
        data: [],
        meta: { count: 0 },
        links: { first: '', next: null, previous: null, last: '' },
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      await SourcesService.findSourceByName('test-name');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { name: 'test-name' },
      });
    });
  });
});
