import axiosInstance from '../api';

import { runTag } from './awsOcpTags';
import { TagType } from './tag';

test('runForecast API request for OCP on AWS', () => {
  runTag(TagType.tag, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('tags/openshift/infrastructures/aws/?');
});
