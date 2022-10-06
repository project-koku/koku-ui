import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';

type DashboardOwnProps = WrappedComponentProps;

interface DashboardStateProps {
  costType?: string;
  DashboardWidget: any;
  widgets: number[];
}

interface DashboardDispatchProps {
  selectWidgets?: () => void;
}

type DashboardProps = DashboardOwnProps & DashboardStateProps & DashboardDispatchProps;

const DashboardBase: React.FC<DashboardProps> = ({ costType, DashboardWidget, selectWidgets, widgets }) => (
  <div>
    <Grid hasGutter>
      {widgets.map(widgetId => {
        const widget = selectWidgets[widgetId];
        return widget.details.showHorizontal ? (
          <GridItem sm={12} key={widgetId}>
            <DashboardWidget widgetId={widgetId} {...(costType && { costType })} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <DashboardWidget widgetId={widgetId} {...(costType && { costType })} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

export default DashboardBase;
