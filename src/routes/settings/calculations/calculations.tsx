import { PageSection, Title, TitleSizes, Tooltip } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { CostType } from 'routes/components/costType';
import { Currency } from 'routes/components/currency';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rbacActions, rbacSelectors } from 'store/rbac';
import { settingsActions, settingsSelectors } from 'store/settings';
import { getCostType, getCurrency, setAccountCurrency, setCostType, setCurrency } from 'utils/localStorage';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './calculations.styles';

interface SettingsOwnProps {
  // TBD...
}

interface SettingsDispatchProps {
  fetchRbac: typeof rbacActions.fetchRbac;
  updateSettings: typeof settingsActions.updateSettings;
}

interface SettingsStateProps {
  canWrite?: boolean;
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

  public componentDidMount() {
    this.updateReport();
  }

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

  private updateReport = () => {
    const { fetchRbac } = this.props;
    fetchRbac();
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
    canWrite: rbacSelectors.isSettingsWritePermission(state),
    updateSettingsStatus,
  };
});

const mapDispatchToProps: SettingsDispatchProps = {
  fetchRbac: rbacActions.fetchRbac,
  updateSettings: settingsActions.updateSettings,
};

const Calculations = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingsBase)));

export default Calculations;
