import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpUsageDashboardSelectors } from 'store/dashboard/ocpUsageDashboard';
import { OcpUsageDashboardWidget } from './ocpUsageDashboardWidget';

type OcpUsageDashboardOwnProps = InjectedTranslateProps;

interface OcpUsageDashboardStateProps {
  widgets: number[];
}

interface OcpUsageDashboardDispatchProps {
  selectWidgets?: typeof ocpUsageDashboardSelectors.selectWidgets;
}

type OcpUsageDashboardProps = OcpUsageDashboardOwnProps &
  OcpUsageDashboardStateProps &
  OcpUsageDashboardDispatchProps;

const OcpUsageDashboardBase: React.SFC<OcpUsageDashboardProps> = ({
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
            <OcpUsageDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <OcpUsageDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpUsageDashboardOwnProps,
  OcpUsageDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpUsageDashboardSelectors.selectWidgets(state),
    widgets: ocpUsageDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpUsageDashboard = translate()(
  connect(mapStateToProps, {})(OcpUsageDashboardBase)
);

export default OcpUsageDashboard;
