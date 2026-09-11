import { axiosInstance } from 'api';
import { ResourceType } from './resource';
import { runResource } from './ocpResource';

describe('ocpResource', () => {
  test('runResource uses the project path', () => {
    runResource(ResourceType.project, 'limit=1');
    expect(axiosInstance.get).toHaveBeenCalledWith('resource-types/openshift-projects/?limit=1');
  });
});
