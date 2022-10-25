import * as awsOcpDashboardActions from './awsOcpDashboardActions';
import type { AwsOcpDashboardWidget } from './awsOcpDashboardCommon';
import { awsOcpDashboardStateKey, AwsOcpDashboardTab } from './awsOcpDashboardCommon';
import { awsOcpDashboardReducer } from './awsOcpDashboardReducer';
import * as awsOcpDashboardSelectors from './awsOcpDashboardSelectors';

export type { AwsOcpDashboardWidget };
export {
  awsOcpDashboardStateKey,
  awsOcpDashboardReducer,
  awsOcpDashboardActions,
  awsOcpDashboardSelectors,
  AwsOcpDashboardTab,
};
