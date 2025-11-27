import axiosInstance from '../api';

import { runTag } from './azureTags';
import { TagType } from './tag';

test('runTag API request for Azure', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`tags/azure/?${query}`);
});
