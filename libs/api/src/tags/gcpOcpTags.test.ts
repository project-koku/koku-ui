import axiosInstance from '../api';

import { runTag } from './gcpOcpTags';
import { TagType } from './tag';

test('runTag API request for OCP on GCP', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`tags/openshift/infrastructures/gcp/?${query}`);
});
