jest.mock('axios');

import axios from 'axios';
import { OcpCloudReportType, runReport } from './ocpCloudReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(OcpCloudReportType.cost, query);
  expect(axios.get).toBeCalledWith(
    `reports/openshift/infrastructures/all/costs/?${query}`
  );
});
