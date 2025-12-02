import axiosInstance from '../api';

import { runTag } from './ocpCloudTags';
import { TagType } from './tag';

test('runForecast API request for all cloud filtered by OCP', () => {
  runTag(TagType.tag, '');
  expect(axiosInstance.get).toHaveBeenCalledWith('tags/openshift/infrastructures/all/?');
});
