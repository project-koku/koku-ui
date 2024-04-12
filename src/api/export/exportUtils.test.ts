import { waitFor } from '@testing-library/react';
import { ReportPathsType, ReportType } from 'api/reports/report';

import * as exportUtils from './exportUtils';

jest.spyOn(exportUtils, 'runExport');

test('runExport API request', async () => {
  exportUtils.runExport(ReportPathsType.ocp, ReportType.cost, '');
  await waitFor(() => expect(exportUtils.runExport).toHaveBeenCalled());
});
