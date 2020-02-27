import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { azureCloudDashboardSelectors } from 'store/azureCloudDashboard';
import { createMapStateToProps } from 'store/common';
import { AzureCloudDashboardWidget } from './azureCloudDashboardWidget';

type AzureCloudDashboardOwnProps = InjectedTranslateProps;

interface AzureCloudDashboardStateProps {
  widgets: number[];
}

interface AzureCloudDashboardDispatchProps {
  selectWidgets?: typeof azureCloudDashboardSelectors.selectWidgets;
}

type AzureCloudDashboardProps = AzureCloudDashboardOwnProps &
  AzureCloudDashboardStateProps &
  AzureCloudDashboardDispatchProps;

const AzureCloudDashboardBase: React.SFC<AzureCloudDashboardProps> = ({
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
            <AzureCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <AzureCloudDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  AzureCloudDashboardOwnProps,
  AzureCloudDashboardStateProps
>(state => {
  return {
    selectWidgets: azureCloudDashboardSelectors.selectWidgets(state),
    widgets: azureCloudDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureCloudDashboard = translate()(
  connect(mapStateToProps, {})(AzureCloudDashboardBase)
);

export default AzureCloudDashboard;
