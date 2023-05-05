import { Button, ButtonVariant, PageSection, Title, TitleSizes } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';
import { getCostType, getCurrency, setCostType, setCurrency } from 'utils/localStorage';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './calculations.styles';

interface SettingsOwnProps {
  // TBD...
}

interface SettingsDispatchProps {
  updateSettings: typeof settingsActions.updateSettings;
}

interface SettingsStateProps {
  updateSettingsStatus: FetchStatus;
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
    currentCostType: getCostType(),
    currentCurrency: getCurrency(),
  };
  public state: SettingsState = { ...this.defaultState };

  private getActions = () => {
    const { intl } = this.props;
    const { currentCostType, currentCurrency } = this.state;

    const isDisabled = currentCostType === getCostType() && currentCurrency === getCurrency();

    return (
      <div style={styles.actionsContainer}>
        <Button isDisabled={isDisabled} key="save" onClick={this.handleOnSave} variant={ButtonVariant.primary}>
          {intl.formatMessage(messages.save)}
        </Button>
        <div style={styles.resetContainer}>
          <Button isDisabled={isDisabled} key="reset" onClick={this.handleOnReset} variant={ButtonVariant.secondary}>
            {intl.formatMessage(messages.reset)}
          </Button>
        </div>
      </div>
    );
  };

  private getCostType = () => {
    const { intl } = this.props;
    const { currentCostType } = this.state;

    return (
      <div style={styles.costTypeContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.xl}>
          {intl.formatMessage(messages.costTypeSettingsLabel)}
        </Title>
        {intl.formatMessage(messages.costTypeSettingsDesc)}
        <div style={styles.costType}>
          <CostType
            costType={currentCostType}
            isLocalStorage={false}
            onSelect={this.handleOnCostTypeSelected}
            showLabel={false}
          />
        </div>
      </div>
    );
  };

  private getCurrency = () => {
    const { intl } = this.props;
    const { currentCurrency } = this.state;

    return (
      <div style={styles.currencyContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.xl}>
          {intl.formatMessage(messages.currency)}
        </Title>
        {intl.formatMessage(messages.currencyDesc)}
        <div style={styles.currency}>
          <Currency
            currency={currentCurrency}
            isLocalStorage={false}
            onSelect={this.handleOnCurrencySelected}
            showLabel={false}
          />
        </div>
      </div>
    );
  };

  private handleOnCostTypeSelected = value => {
    this.setState({ currentCostType: value });
  };

  private handleOnCurrencySelected = value => {
    this.setState({ currentCurrency: value });
  };

  private handleOnReset = () => {
    this.setState({ currentCostType: getCostType(), currentCurrency: getCurrency() });
  };

  private handleOnSave = () => {
    const { updateSettings } = this.props;
    const { currentCostType, currentCurrency } = this.state;

    setCostType(currentCostType);
    setCurrency(currentCurrency);
    updateSettings({
      api: {
        settings: {
          cost_type: currentCostType,
          currency: currentCurrency,
        },
      },
    });
  };

  public render() {
    return (
      <PageSection isFilled>
        {this.getCurrency()}
        {this.getCostType()}
        {this.getActions()}
      </PageSection>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<SettingsOwnProps, SettingsStateProps>(state => {
  const updateSettingsStatus = settingsSelectors.selectSettingsUpdateStatus(state);

  return {
    updateSettingsStatus,
  };
});

const mapDispatchToProps: SettingsDispatchProps = {
  updateSettings: settingsActions.updateSettings,
};

const Calculations = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsBase)));

export default Calculations;
