jest.mock('axios');

import axios from 'axios';
import { OcpReportType, runReport } from './ocpReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(OcpReportType.cost, query);
  expect(axios.get).toBeCalledWith(`reports/openshift/costs/?${query}`);
});
