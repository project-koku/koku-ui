import axiosInstance from '../api';

import { runTag } from './azureOcpTags';
import { TagType } from './tag';

test('runForecast API request for OCP on Azure', () => {
  runTag(TagType.tag, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('tags/openshift/infrastructures/azure/?');
});
