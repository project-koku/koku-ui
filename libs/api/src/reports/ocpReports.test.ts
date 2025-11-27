import axiosInstance from '../api';
import { ReportType } from './report';

import { runReport } from './ocpReports';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runReport(ReportType.cost, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`reports/openshift/costs/?${query}`);
});
