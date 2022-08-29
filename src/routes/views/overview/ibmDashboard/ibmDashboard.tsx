import { DashboardBase } from 'routes/views/overview/components/dashboardBase';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ibmDashboardSelectors } from 'store/dashboard/ibmDashboard';

import { IbmDashboardWidget } from './ibmDashboardWidget';

type IbmDashboardOwnProps = any;

interface IbmDashboardStateProps {
  DashboardWidget: typeof IbmDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<IbmDashboardOwnProps, IbmDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: IbmDashboardWidget,
    selectWidgets: ibmDashboardSelectors.selectWidgets(state),
    widgets: ibmDashboardSelectors.selectCurrentWidgets(state),
  };
});

const IbmDashboard = connect(mapStateToProps, {})(DashboardBase);

export default IbmDashboard;
