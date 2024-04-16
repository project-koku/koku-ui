import { axiosInstance } from 'api';

import { runTag } from './rhelTags';
import { TagType } from './tag';

test('runTag API request for RHEL', () => {
  runTag(TagType.tag, '');
  expect(axiosInstance.get).toBeCalledWith('tags/openshift/?');
});
