jest.mock('axios');

import axios from 'axios';
import { fetchProviders } from './costModelsProviders';

test('api get provider calls axios.get', () => {
  fetchProviders('type=AWS');
  expect(axios.get).toBeCalledWith('providers/?type=AWS');
});
