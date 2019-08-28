import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { azureDashboardSelectors } from 'store/azureDashboard';
import { createMapStateToProps } from 'store/common';
import { AzureDashboardWidget } from './azureDashboardWidget';

type AzureDashboardOwnProps = InjectedTranslateProps;

interface AzureDashboardStateProps {
  widgets: number[];
}

interface AzureDashboardDispatchProps {
  selectWidgets?: typeof azureDashboardSelectors.selectWidgets;
}

type AzureDashboardProps = AzureDashboardOwnProps &
  AzureDashboardStateProps &
  AzureDashboardDispatchProps;

const AzureDashboardBase: React.SFC<AzureDashboardProps> = ({
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
            <AzureDashboardWidget widgetId={widgetId} />
          </GridItem>
        ) : (
          <GridItem lg={12} xl={6} xl2={4} key={widgetId}>
            <AzureDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  AzureDashboardOwnProps,
  AzureDashboardStateProps
>(state => {
  return {
    selectWidgets: azureDashboardSelectors.selectWidgets(state),
    widgets: azureDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AzureDashboard = translate()(
  connect(
    mapStateToProps,
    {}
  )(AzureDashboardBase)
);

export default AzureDashboard;
