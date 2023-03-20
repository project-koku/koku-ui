import { connect } from 'react-redux';
import { DashboardBase } from 'routes/views/overview/components';
import type { DashboardStateProps } from 'routes/views/overview/components/dashboardBase';
import { createMapStateToProps } from 'store/common';
import { awsDashboardSelectors } from 'store/dashboard/awsDashboard';

import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsDashboardOwnProps, DashboardStateProps>((state, props) => {
  return {
    DashboardWidget: AwsDashboardWidget,
    selectWidgets: awsDashboardSelectors.selectWidgets(state),
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = connect(mapStateToProps, {})(DashboardBase);

export default AwsDashboard;
