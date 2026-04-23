import { axiosInstance } from './axios-client';
import { ApplicationsService } from './applications-service';

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

describe('ApplicationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

      const result = await ApplicationsService.createApplication(createData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/cost-management/v1/applications', createData);
      expect(result).toEqual(mockApplication);
    });
  });
});
