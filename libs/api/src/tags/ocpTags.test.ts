import axiosInstance from '../api';

import { runTag } from './ocpTags';
import { TagType } from './tag';

test('runTag API request for OCP', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`tags/openshift/?${query}`);
});
