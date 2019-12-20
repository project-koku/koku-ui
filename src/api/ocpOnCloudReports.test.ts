jest.mock('axios');

import axios from 'axios';
import { OcpOnCloudReportType, runReport } from './ocpOnCloudReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(OcpOnCloudReportType.cost, query);
  expect(axios.get).toBeCalledWith(
    `reports/openshift/infrastructures/all/costs/?${query}`
  );
});
