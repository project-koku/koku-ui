import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpOnAwsDashboardSelectors } from 'store/ocpOnAwsDashboard';
import { OcpOnAwsDashboardWidget } from './ocpOnAwsDashboardWidget';

type OcpOnAwsDashboardOwnProps = InjectedTranslateProps;

interface OcpOnAwsDashboardStateProps {
  widgets: number[];
}

interface OcpOnAwsDashboardDispatchProps {
  selectWidgets?: typeof ocpOnAwsDashboardSelectors.selectWidgets;
}

type OcpOnAwsDashboardProps = OcpOnAwsDashboardOwnProps &
  OcpOnAwsDashboardStateProps &
  OcpOnAwsDashboardDispatchProps;

const OcpOnAwsDashboardBase: React.SFC<OcpOnAwsDashboardProps> = ({
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
            <OcpOnAwsDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem xl={4} lg={6} key={widgetId}>
            <OcpOnAwsDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpOnAwsDashboardOwnProps,
  OcpOnAwsDashboardStateProps
>(state => {
  return {
    selectWidgets: ocpOnAwsDashboardSelectors.selectWidgets(state),
    widgets: ocpOnAwsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpOnAwsDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(OcpOnAwsDashboardBase)
);

export default OcpOnAwsDashboard;
