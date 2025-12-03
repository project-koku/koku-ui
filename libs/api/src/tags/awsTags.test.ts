import axiosInstance from '../api';

import { runTag } from './awsTags';
import { TagType } from './tag';

test('runTag API request for AWS', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`tags/aws/?${query}`);
});
