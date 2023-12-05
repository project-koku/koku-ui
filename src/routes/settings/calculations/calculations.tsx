import { PageSection, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import { AccountSettingsType } from 'api/accountSettings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { getAccountCostType, getAccountCurrency } from 'utils/localStorage';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './calculations.styles';

interface SettingsOwnProps {
  canWrite?: boolean;
}

interface SettingsDispatchProps {
  updateCostType: typeof accountSettingsActions.updateAccountSettings;
  updateCurrency: typeof accountSettingsActions.updateAccountSettings;
}

interface SettingsStateProps {
  updateCostTypeStatus: FetchStatus;
  updateCurrencyStatus: FetchStatus;
}

interface SettingsState {
  currentCostType?: string;
  currentCurrency?: string;
}

type SettingsProps = SettingsOwnProps &
  SettingsStateProps &
  SettingsDispatchProps &
  RouterComponentProps &
  WrappedComponentProps;

class SettingsBase extends React.Component<SettingsProps, SettingsState> {
  protected defaultState: SettingsState = {
    currentCostType: getAccountCostType(),
    currentCurrency: getAccountCurrency(),
  };
  public state: SettingsState = { ...this.defaultState };

  private getCostType = () => {
    const { canWrite, intl } = this.props;
    const { currentCostType } = this.state;

    return (
      <div style={styles.costTypeContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.costTypeSettingsLabel)}
        </Title>
        {intl.formatMessage(messages.costTypeSettingsDesc)}
        <div style={styles.costType}>
          {this.getTooltip(
            <CostType
              costType={currentCostType}
              isDisabled={!canWrite}
              isLocalStorage={false}
              onSelect={this.handleOnCostTypeSelected}
              showLabel={false}
            />
          )}
        </div>
      </div>
    );
  };

  private getCurrency = () => {
    const { canWrite, intl } = this.props;
    const { currentCurrency } = this.state;

    return (
      <div style={styles.currencyContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
          {intl.formatMessage(messages.currency)}
        </Title>
        {intl.formatMessage(messages.currencyDesc)}
        <div style={styles.currency}>
          {this.getTooltip(
            <Currency
              currency={currentCurrency}
              isDisabled={!canWrite}
              isLocalStorage={false}
              onSelect={this.handleOnCurrencySelected}
              showLabel={false}
            />
          )}
        </div>
      </div>
    );
  };

  private getTooltip = comp => {
    const { canWrite, intl } = this.props;

    return !canWrite ? <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>{comp}</Tooltip> : comp;
  };

  private handleOnCostTypeSelected = value => {
    const { updateCostType } = this.props;

    this.setState({ currentCostType: value }, () => {
      updateCostType(AccountSettingsType.costType, {
        cost_type: value,
      });
    });
  };

  private handleOnCurrencySelected = value => {
    const { updateCurrency } = this.props;

    this.setState({ currentCurrency: value }, () => {
      updateCurrency(AccountSettingsType.currency, {
        currency: value,
      });
    });
  };

  public render() {
    return (
      <PageSection isFilled>
        {this.getCurrency()}
        {this.getCostType()}
      </PageSection>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<SettingsOwnProps, SettingsStateProps>(state => {
  const updateCostTypeStatus = accountSettingsSelectors.selectAccountSettingsUpdateStatus(
    state,
    AccountSettingsType.costType
  );
  const updateCurrencyStatus = accountSettingsSelectors.selectAccountSettingsUpdateStatus(
    state,
    AccountSettingsType.currency
  );

  return {
    updateCostTypeStatus,
    updateCurrencyStatus,
  };
});

const mapDispatchToProps: SettingsDispatchProps = {
  updateCostType: accountSettingsActions.updateAccountSettings,
  updateCurrency: accountSettingsActions.updateAccountSettings,
};

const Calculations = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsBase)));

export default Calculations;
