import { Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ocpDashboardSelectors } from 'store/ocpDashboard';
import { uiActions } from 'store/ui';
import { OcpDashboardWidget } from './ocpDashboardWidget';

type OcpDashboardOwnProps = InjectedTranslateProps;

interface OcpDashboardStateProps {
  widgets: number[];
}

interface OcpDashboardDispatchProps {
  openProvidersModal: typeof uiActions.openProvidersModal;
}

type OcpDashboardProps = OcpDashboardOwnProps &
  OcpDashboardStateProps &
  OcpDashboardDispatchProps;

const OcpDashboardBase: React.SFC<OcpDashboardProps> = ({
  t,
  openProvidersModal,
  widgets,
}) => (
  <div>
    <Grid gutter="md">
      {widgets.map(widgetId => {
        return (
          <GridItem xl={4} lg={6} key={widgetId}>
            <OcpDashboardWidget widgetId={widgetId} />
          </GridItem>
        );
      })}
    </Grid>
  </div>
);

const mapStateToProps = createMapStateToProps<
  OcpDashboardOwnProps,
  OcpDashboardStateProps
>(state => {
  return {
    widgets: ocpDashboardSelectors.selectCurrentWidgets(state),
  };
});

const OcpDashboard = translate()(
  connect(
    mapStateToProps,
    {
      openProvidersModal: uiActions.openProvidersModal,
    }
  )(OcpDashboardBase)
);

export default OcpDashboard;
