import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/ocpDashboard';
import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = InjectedTranslateProps;

interface OcpDashboardStateProps {
  widgets: number[];
}

interface OcpDashboardDispatchProps {
  selectWidgets?: typeof ocpDashboardSelectors.selectWidgets;
}

type OcpDashboardProps = OcpDashboardOwnProps &
  OcpDashboardStateProps &
  OcpDashboardDispatchProps;

const OcpDashboardBase: React.SFC<OcpDashboardProps> = ({
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
            <OcpDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem xl={4} lg={6} key={widgetId}>
            <OcpDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpDashboardOwnProps,
  OcpDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpDashboardSelectors.selectWidgets(state),
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(OcpDashboardBase)
);

export default OcpDashboard;
