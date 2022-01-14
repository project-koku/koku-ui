import { AccountSettings } from 'api/accountSettings';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { allUserAccessQuery, userAccessSelectors } from 'store/userAccess';
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
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
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
  protected defaultState: AccountSettingsState = {
    // TBD...
  };
  public state: AccountSettingsState = { ...this.defaultState };

  public componentDidMount() {
    this.updateAccountSettings();
  }

  public componentDidUpdate(prevProps: AccountSettingsProps) {
    const { accountSettings } = this.props;

    if (prevProps.accountSettings !== accountSettings) {
      // To do: Adjust meta properties when account-settings API is available
      const costType = accountSettings ? accountSettings.data.cost_type : CostTypes.unblended;
      const currency = accountSettings ? accountSettings.data.currency : 'USD';

      // Force update to render children
      this.setState({
        costType,
        currency,
      });
    }
  }

  private updateAccountSettings = () => {
    const { accountSettingsFetchStatus, fetchAccountSettings } = this.props;

    if (accountSettingsFetchStatus !== FetchStatus.inProgress) {
      fetchAccountSettings();
    }
  };

  public render() {
    const { accountSettingsFetchStatus, children } = this.props;

    return accountSettingsFetchStatus === FetchStatus.complete ? children : null;
  }
}

const mapStateToProps = createMapStateToProps<AccountSettingsOwnProps, AccountSettingsStateProps>(state => {
  const accountSettings = accountSettingsSelectors.selectAccountSettings(state);
  const accountSettingsError = accountSettingsSelectors.selectAccountSettingsError(state);
  const accountSettingsFetchStatus = accountSettingsSelectors.selectAccountSettingsFetchStatus(state);

  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    accountSettings,
    accountSettingsError,
    accountSettingsFetchStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: AccountSettingsDispatchProps = {
  fetchAccountSettings: accountSettingsActions.fetchAccountSettings,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(AccountSettingsBase);
const AccountSettings = injectIntl(CostTypeConnect);

export { AccountSettings };
