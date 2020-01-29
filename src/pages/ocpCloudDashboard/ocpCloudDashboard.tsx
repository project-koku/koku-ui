import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpCloudDashboardSelectors } from 'store/ocpCloudDashboard';
import { OcpCloudDashboardWidget } from './ocpCloudDashboardWidget';

type OcpCloudDashboardOwnProps = InjectedTranslateProps;

interface OcpCloudDashboardStateProps {
  widgets: number[];
}

interface OcpCloudDashboardDispatchProps {
  selectWidgets?: typeof ocpCloudDashboardSelectors.selectWidgets;
}

type OcpCloudDashboardProps = OcpCloudDashboardOwnProps &
  OcpCloudDashboardStateProps &
  OcpCloudDashboardDispatchProps;

const OcpCloudDashboardBase: React.SFC<OcpCloudDashboardProps> = ({
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
            <OcpCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <OcpCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpCloudDashboardOwnProps,
  OcpCloudDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpCloudDashboardSelectors.selectWidgets(state),
    widgets: ocpCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpCloudDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(OcpCloudDashboardBase)
);

export default OcpCloudDashboard;
