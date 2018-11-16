import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { awsDashboardSelectors } from 'store/awsDashboard';
import { createMapStateToProps } from 'store/common';
import { uiActions } from 'store/ui';
import { AwsDashboardWidget } from './awsDashboardWidget';

type AwsDashboardOwnProps = InjectedTranslateProps;

interface AwsDashboardStateProps {
  widgets: number[];
}

interface AwsDashboardDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type AwsDashboardProps = AwsDashboardOwnProps &
  AwsDashboardStateProps &
  AwsDashboardDispatchProps;

const AwsDashboardBase: React.SFC<AwsDashboardProps> = ({
  t,
  openProvidersModal,
  widgets,
}) => (
  <div>
    <Grid gutter="md">
      {widgets.map(widgetId => {
        return (
          <GridItem xl={4} lg={6} key={widgetId}>
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
    widgets: awsDashboardSelectors.selectCurrentWidgets(state),
  };
});

const AwsDashboard = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(AwsDashboardBase)
);

export default AwsDashboard;
