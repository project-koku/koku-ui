jest.mock('axios');

import axios from 'axios';
import { OcpOnAwsReportType, runReport } from './ocpOnAwsReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(OcpOnAwsReportType.cost, query);
  expect(axios.get).toBeCalledWith(
    `reports/openshift/infrastructures/aws/costs/?${query}`
  );
});
