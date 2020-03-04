import { Grid, GridItem } from '@patternfly/react-core';
import { AwsDashboardWidget } from 'pages/dashboard/awsDashboard/awsDashboardWidget';
import { AzureDashboardWidget } from 'pages/dashboard/azureDashboard/azureDashboardWidget';
import { OcpCloudDashboardWidget } from 'pages/dashboard/ocpCloudDashboard/ocpCloudDashboardWidget';
import { OcpDashboardWidget } from 'pages/dashboard/ocpDashboard/ocpDashboardWidget';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

type DashboardOwnProps = InjectedTranslateProps;

interface DashboardStateProps {
  DashboardWidget:
    | typeof AwsDashboardWidget
    | typeof AzureDashboardWidget
    | typeof OcpDashboardWidget
    | typeof OcpCloudDashboardWidget;
  widgets: number[];
}

interface DashboardDispatchProps {
  selectWidgets?: () => void;
}

type DashboardProps = DashboardOwnProps &
  DashboardStateProps &
  DashboardDispatchProps;

const DashboardBase: React.SFC<DashboardProps> = ({
  DashboardWidget,
  selectWidgets,
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

export { DashboardBase };
