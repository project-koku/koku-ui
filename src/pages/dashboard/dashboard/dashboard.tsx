import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { dashboardSelectors } from 'store/dashboard';
import { DashboardWidget } from './dashboardWidget';

type DashboardOwnProps = InjectedTranslateProps;

interface DashboardStateProps {
  widgets: number[];
}

interface DashboardDispatchProps {
  selectWidgets?: typeof dashboardSelectors.selectWidgets;
}

type DashboardProps = DashboardOwnProps &
  DashboardStateProps &
  DashboardDispatchProps;

const DashboardBase: React.SFC<DashboardProps> = ({
  selectWidgets,
  t,
  widgets,
}) => (
  <div>
    <Grid gutter="md">
      {widgets.map(widgetId => {
        const widget = selectWidgets[widgetId];
        return Boolean(widget.isHorizontal) ? (
          <GridItem sm={12} key={widgetId}>
            <DashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <DashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  DashboardOwnProps,
  DashboardStateProps
>(state => {
  return {
    selectWidgets: dashboardSelectors.selectWidgets(state),
    widgets: dashboardSelectors.selectCurrentWidgets(state),
  };
});

const Dashboard = translate()(connect(mapStateToProps, {})(DashboardBase));

export default Dashboard;
