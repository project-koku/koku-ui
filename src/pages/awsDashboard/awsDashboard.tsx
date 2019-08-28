import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsDashboardSelectors } from 'store/awsDashboard';
import { createMapStateToProps } from 'store/common';
import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = InjectedTranslateProps;

interface AwsDashboardStateProps {
  widgets: number[];
}

interface AwsDashboardDispatchProps {
  selectWidgets?: typeof awsDashboardSelectors.selectWidgets;
}

type AwsDashboardProps = AwsDashboardOwnProps &
  AwsDashboardStateProps &
  AwsDashboardDispatchProps;

const AwsDashboardBase: React.SFC<AwsDashboardProps> = ({
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
            <AwsDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <AwsDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  AwsDashboardOwnProps,
  AwsDashboardStateProps
>(state => {
  return {
    selectWidgets: awsDashboardSelectors.selectWidgets(state),
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(AwsDashboardBase)
);

export default AwsDashboard;
