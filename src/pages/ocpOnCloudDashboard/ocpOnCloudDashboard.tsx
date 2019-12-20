import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpOnCloudDashboardSelectors } from 'store/ocpOnCloudDashboard';
import { OcpOnCloudDashboardWidget } from './ocpOnCloudDashboardWidget';

type OcpOnCloudDashboardOwnProps = InjectedTranslateProps;

interface OcpOnCloudDashboardStateProps {
  widgets: number[];
}

interface OcpOnCloudDashboardDispatchProps {
  selectWidgets?: typeof ocpOnCloudDashboardSelectors.selectWidgets;
}

type OcpOnCloudDashboardProps = OcpOnCloudDashboardOwnProps &
  OcpOnCloudDashboardStateProps &
  OcpOnCloudDashboardDispatchProps;

const OcpOnCloudDashboardBase: React.SFC<OcpOnCloudDashboardProps> = ({
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
            <OcpOnCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <OcpOnCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpOnCloudDashboardOwnProps,
  OcpOnCloudDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpOnCloudDashboardSelectors.selectWidgets(state),
    widgets: ocpOnCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpOnCloudDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(OcpOnCloudDashboardBase)
);

export default OcpOnCloudDashboard;
