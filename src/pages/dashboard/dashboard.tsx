import {
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import { dashboardSelectors } from 'store/dashboard';
import { styles, theme } from './dashboard.styles';
import { DashboardWidget } from './dashboardWidget';

import { AccountWizard } from '../../components/accountWizard';
// import PropTypes from 'prop-types';
import store from '../../index';
import reduxTypes from '../../store/constants';
import { getTestProps, testIds } from '../../testIds';

type DashboardOwnProps = RouteComponentProps<{}> & InjectedTranslateProps;

// interface Props extends InjectedTranslateProps {
//   onAddAccount?: PropTypes.func;
// }

interface DashboardStateProps {
  widgets: number[];
}

type DashboardProps = DashboardOwnProps & DashboardStateProps;

// Todo: move
const handleAddAccount = () => {
  store.dispatch({
    type: reduxTypes.account.ADD_ACCOUNT_SHOW,
  });
};

const DashboardBase: React.SFC<DashboardProps> = ({ t, widgets }) => (
  <div className={theme}>
    <header className={css(styles.banner)}>
      <Title size={TitleSize.lg}>{t('dashboard_page.title')}</Title>
      <Button
        variant={ButtonVariant.secondary}
        onClick={handleAddAccount}
        {...getTestProps(testIds.masthead.account)}
      >
        {t('dashboard_page.add_account_title')}
      </Button>
      <AccountWizard />
    </header>
    <div className={css(styles.content)}>
      <Grid gutter="md">
        {widgets.map(widgetId => {
          return (
            <GridItem xl={4} lg={6} key={widgetId}>
              <DashboardWidget widgetId={widgetId} />
            </GridItem>
          );
        })}
      </Grid>
    </div>
  </div>
);

const mapStateToProps = createMapStateToProps<
  DashboardOwnProps,
  DashboardStateProps
>(state => {
  return {
    widgets: dashboardSelectors.selectCurrentWidgets(state),
  };
});

const Dashboard = translate()(connect(mapStateToProps)(DashboardBase));

export default Dashboard;
