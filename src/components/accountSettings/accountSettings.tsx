import { AccountSettings } from 'api/accountSettings';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { CostTypes } from 'utils/localStorage';

interface AccountSettingsOwnProps {
  children?: React.ReactNode;
}

interface AccountSettingsDispatchProps {
  fetchAccountSettings?: typeof accountSettingsActions.fetchAccountSettings;
}

interface AccountSettingsStateProps {
  accountSettings: AccountSettings;
  accountSettingsError: AxiosError;
  accountSettingsFetchStatus?: FetchStatus;
}

interface AccountSettingsState {
  costType?: CostTypes;
  currency?: string;
}

type AccountSettingsProps = AccountSettingsOwnProps &
  AccountSettingsDispatchProps &
  AccountSettingsStateProps &
  WrappedComponentProps;

class AccountSettingsBase extends React.Component<AccountSettingsProps> {
  protected defaultState: AccountSettingsState = {};
  public state: AccountSettingsState = { ...this.defaultState };

  public componentDidMount() {
    const { accountSettingsFetchStatus, fetchAccountSettings } = this.props;

    // Note: API cache is reset via the AppSettings component, so this is not called twice
    if (accountSettingsFetchStatus !== FetchStatus.inProgress && accountSettingsFetchStatus !== FetchStatus.complete) {
      fetchAccountSettings();
    }
  }

  public componentDidUpdate(prevProps: AccountSettingsProps) {
    const { accountSettings } = this.props;

    if (prevProps.accountSettings !== accountSettings) {
      const costType = accountSettings ? accountSettings.data.cost_type : CostTypes.unblended;
      const currency = accountSettings ? accountSettings.data.currency : 'USD';

      // Force update to render children
      this.setState({
        costType,
        currency,
      });
    }
  }

  public render() {
    const { accountSettingsFetchStatus, children } = this.props;

    return accountSettingsFetchStatus === FetchStatus.complete ? children : null;
  }
}

const mapStateToProps = createMapStateToProps<AccountSettingsOwnProps, AccountSettingsStateProps>(state => {
  const accountSettings = accountSettingsSelectors.selectAccountSettings(state);
  const accountSettingsError = accountSettingsSelectors.selectAccountSettingsError(state);
  const accountSettingsFetchStatus = accountSettingsSelectors.selectAccountSettingsFetchStatus(state);

  return {
    accountSettings,
    accountSettingsError,
    accountSettingsFetchStatus,
  };
});

const mapDispatchToProps: AccountSettingsDispatchProps = {
  fetchAccountSettings: accountSettingsActions.fetchAccountSettings,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(AccountSettingsBase);
const AccountSettings = injectIntl(CostTypeConnect);

export { AccountSettings };
