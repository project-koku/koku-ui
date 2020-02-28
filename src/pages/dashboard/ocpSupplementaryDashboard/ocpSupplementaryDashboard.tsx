import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpSupplementaryDashboardSelectors } from 'store/ocpSupplementaryDashboard';
import { OcpSupplementaryDashboardWidget } from './ocpSupplementaryDashboardWidget';

type OcpSupplementaryDashboardOwnProps = InjectedTranslateProps;

interface OcpSupplementaryDashboardStateProps {
  widgets: number[];
}

interface OcpSupplementaryDashboardDispatchProps {
  selectWidgets?: typeof ocpSupplementaryDashboardSelectors.selectWidgets;
}

type OcpSupplementaryDashboardProps = OcpSupplementaryDashboardOwnProps &
  OcpSupplementaryDashboardStateProps &
  OcpSupplementaryDashboardDispatchProps;

const OcpSupplementaryDashboardBase: React.SFC<OcpSupplementaryDashboardProps> = ({
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
            <OcpSupplementaryDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <OcpSupplementaryDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpSupplementaryDashboardOwnProps,
  OcpSupplementaryDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpSupplementaryDashboardSelectors.selectWidgets(state),
    widgets: ocpSupplementaryDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpSupplementaryDashboard = translate()(
  connect(mapStateToProps, {})(OcpSupplementaryDashboardBase)
);

export default OcpSupplementaryDashboard;
