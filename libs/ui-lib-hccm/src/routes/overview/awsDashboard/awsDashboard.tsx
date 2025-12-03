import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { awsDashboardSelectors } from '../../../store/dashboard/awsDashboard';
import { DashboardBase } from '../components';
import type { DashboardStateProps } from '../components/dashboardBase';
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
