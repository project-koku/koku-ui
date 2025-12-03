import axiosInstance from '../api';

import { runTag } from './gcpTags';
import { TagType } from './tag';

test('runTag API request for GCP', () => {
  const query = 'filter[resolution]=daily';
  runTag(TagType.tag, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`tags/gcp/?${query}`);
});
