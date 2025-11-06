import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';

type DashboardOwnProps = WrappedComponentProps;

export interface DashboardStateProps {
  costType?: string;
  currency?: string;
  DashboardWidget?: any;
  selectWidgets?: Record<number, any>;
  widgets?: number[];
}

type DashboardProps = DashboardOwnProps & DashboardStateProps;

const DashboardBase: React.FC<DashboardProps> = ({ costType, currency, DashboardWidget, selectWidgets, widgets }) => (
  <div>
    <Grid hasGutter>
      {widgets.map(widgetId => {
        const widget = selectWidgets[widgetId];
        return widget.details && widget.details.showHorizontal ? (
          <GridItem sm={12} key={widgetId}>
            <DashboardWidget widgetId={widgetId} {...(costType && { costType })} {...(currency && { currency })} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <DashboardWidget widgetId={widgetId} {...(costType && { costType })} {...(currency && { currency })} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

export default DashboardBase;
