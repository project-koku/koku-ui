import { DashboardBase } from 'pages/dashboard/components/dashboardBase';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { awsDashboardSelectors } from 'store/dashboard/awsDashboard';
import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = WrappedComponentProps;

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

const AwsDashboard = injectIntl(connect(mapStateToProps, {})(DashboardBase));

export default AwsDashboard;
