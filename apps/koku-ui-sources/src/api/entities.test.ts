import { AxiosError } from 'axios';

import axios from './api';
import {
  listSources,
  getSource,
  createSource,
  updateSource,
  deleteSource,
  pauseSource,
  resumeSource,
  createApplication,
  findSourceByName,
  getApiErrorMessage,
} from './entities';

jest.mock('./api');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('entities API', () => {
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

      await listSources();

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

      await listSources({ name: 'test' });

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

      await listSources({ ordering: 'name' });

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

      await listSources({ ordering: '-created_timestamp' });

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { ordering: '-created_timestamp' },
      });
    });
  });

  describe('getSource', () => {
    it('calls axios.get with correct URL for uuid', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test' };
      mockedAxios.get.mockResolvedValue({ data: mockSource });

      const result = await getSource('uuid-1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/uuid-1/'
      );
      expect(result).toEqual(mockSource);
    });
  });

  describe('createSource', () => {
    it('calls axios.post with correct data', async () => {
      const createData = { name: 'x', source_type: 'OCP' };
      const mockSource = { id: 1, uuid: 'uuid-1', ...createData };
      mockedAxios.post.mockResolvedValue({ data: mockSource });

      const result = await createSource(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/',
        createData
      );
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

      await createSource(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cost-management/v1/sources/', createData);
    });
  });

  describe('updateSource', () => {
    it('calls axios.patch with correct URL and data', async () => {
      const updateData = { name: 'new' };
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'new' };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await updateSource('uuid-1', updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/uuid-1/',
        updateData
      );
      expect(result).toEqual(mockSource);
    });
  });

  describe('deleteSource', () => {
    it('calls axios.delete with correct URL', async () => {
      mockedAxios.delete.mockResolvedValue({});

      await deleteSource('uuid-1');

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/uuid-1/'
      );
    });
  });

  describe('pauseSource', () => {
    it('calls axios.patch with only paused: true', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test', source_type: 'OCP', paused: true };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await pauseSource({ uuid: 'uuid-1' });

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/uuid-1/',
        { paused: true }
      );
      expect(result).toEqual(mockSource);
    });
  });

  describe('resumeSource', () => {
    it('calls axios.patch with only paused: false', async () => {
      const mockSource = { id: 1, uuid: 'uuid-1', name: 'Test', source_type: 'OCP', paused: false };
      mockedAxios.patch.mockResolvedValue({ data: mockSource });

      const result = await resumeSource({ uuid: 'uuid-1' });

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/cost-management/v1/sources/uuid-1/',
        { paused: false }
      );
      expect(result).toEqual(mockSource);
    });
  });

  describe('createApplication', () => {
    it('calls axios.post to applications path with correct data', async () => {
      const createData = {
        source_id: 1,
        application_type_id: 2,
        extra: {},
      };
      const mockApplication = { id: 1, ...createData };
      mockedAxios.post.mockResolvedValue({ data: mockApplication });

      const result = await createApplication(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/cost-management/v1/applications',
        createData
      );
      expect(result).toEqual(mockApplication);
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

      await findSourceByName('test-name');

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/cost-management/v1/sources/', {
        params: { name: 'test-name' },
      });
    });
  });

  describe('getApiErrorMessage', () => {
    it('returns detail from AxiosError response JSON', () => {
      const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        data: { detail: 'Not allowed' },
      } as AxiosError['response']);
      expect(getApiErrorMessage(err)).toBe('Not allowed');
    });

    it('returns first field error string from DRF-style body', () => {
      const err = new AxiosError('fail', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        data: { source_type: ['Either source_type or source_type_id is required'] },
      } as AxiosError['response']);
      expect(getApiErrorMessage(err)).toBe('Either source_type or source_type_id is required');
    });

    it('returns Error.message for plain Error', () => {
      expect(getApiErrorMessage(new Error('network down'))).toBe('network down');
    });
  });
});
