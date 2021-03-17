import { DashboardBase } from 'pages/views/overview/components/dashboardBase';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsDashboardSelectors } from 'store/dashboard/awsDashboard';

import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = WithTranslation;

interface AwsDashboardStateProps {
  DashboardWidget: typeof AwsDashboardWidget;
  widgets: number[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsDashboardOwnProps, AwsDashboardStateProps>((state, props) => {
  return {
    DashboardWidget: AwsDashboardWidget,
    selectWidgets: awsDashboardSelectors.selectWidgets(state),
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = withTranslation()(connect(mapStateToProps, {})(DashboardBase));

export default AwsDashboard;
