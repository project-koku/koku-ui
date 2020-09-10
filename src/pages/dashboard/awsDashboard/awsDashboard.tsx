import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsDashboardSelectors } from 'store/dashboard/awsDashboard';

import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = InjectedTranslateProps;

interface AwsDashboardStateProps {
  DashboardWidget: typeof AwsDashboardWidget;
  widgets: number[];
}

const mapStateToProps = createMapStateToProps<
  AwsDashboardOwnProps,
  AwsDashboardStateProps
>(state => {
  return {
    DashboardWidget: AwsDashboardWidget,
    selectWidgets: awsDashboardSelectors.selectWidgets(state),
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = translate()(connect(mapStateToProps, {})(DashboardBase));

export default AwsDashboard;
