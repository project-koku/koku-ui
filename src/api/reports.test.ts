jest.mock('axios');

import axios from 'axios';
import { ReportType, runReport } from './reports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/costs/aws/?${query}`);
});
