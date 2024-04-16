import { axiosInstance } from 'api';

import { runTag } from './ociTags';
import { TagType } from './tag';

test('runTag API request for OCI', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toBeCalledWith(`tags/oci/?${query}`);
});
