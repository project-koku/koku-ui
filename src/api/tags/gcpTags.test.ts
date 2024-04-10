import { axiosInstance } from 'api';

import { runTag } from './gcpTags';
import { TagType } from './tag';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toBeCalledWith(`tags/gcp/?${query}`);
});
