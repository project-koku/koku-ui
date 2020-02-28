import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsCloudDashboardSelectors } from 'store/awsCloudDashboard';
import { createMapStateToProps } from 'store/common';
import { AwsCloudDashboardWidget } from './awsCloudDashboardWidget';

type AwsCloudDashboardOwnProps = InjectedTranslateProps;

interface AwsCloudDashboardStateProps {
  widgets: number[];
}

interface AwsCloudDashboardDispatchProps {
  selectWidgets?: typeof awsCloudDashboardSelectors.selectWidgets;
}

type AwsCloudDashboardProps = AwsCloudDashboardOwnProps &
  AwsCloudDashboardStateProps &
  AwsCloudDashboardDispatchProps;

const AwsCloudDashboardBase: React.SFC<AwsCloudDashboardProps> = ({
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
            <AwsCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <AwsCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  AwsCloudDashboardOwnProps,
  AwsCloudDashboardStateProps
>(state => {
  return {
    selectWidgets: awsCloudDashboardSelectors.selectWidgets(state),
    widgets: awsCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsCloudDashboard = translate()(
  connect(mapStateToProps, {})(AwsCloudDashboardBase)
);

export default AwsCloudDashboard;
