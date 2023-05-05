import { PageSection, Title, TitleSizes } from '@patternfly/react-core';
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
import { getCostType, getCurrency, setAccountCurrency, setCostType, setCurrency } from 'utils/localStorage';
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

  private getCostType = () => {
    const { intl } = this.props;
    const { currentCostType } = this.state;

    return (
      <div style={styles.costTypeContainer}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
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
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.md}>
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
    const { updateSettings } = this.props;

    this.setState({ currentCostType: value }, () => {
      setCostType(value);
      updateSettings({
        api: {
          settings: {
            cost_type: value,
          },
        },
      });
    });
  };

  private handleOnCurrencySelected = value => {
    const { updateSettings } = this.props;

    this.setState({ currentCurrency: value }, () => {
      setCurrency(value);
      setAccountCurrency(value); // Todo: remove account currency after settings page has been moved
      updateSettings({
        api: {
          settings: {
            currency: value,
          },
        },
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
