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

interface AccountSettingsWrapperOwnProps {
  children?: React.ReactNode;
}

interface AccountSettingsWrapperDispatchProps {
  fetchAccountSettings?: typeof accountSettingsActions.fetchAccountSettings;
}

interface AccountSettingsWrapperStateProps {
  accountSettings: AccountSettings;
  accountSettingsError: AxiosError;
  accountSettingsFetchStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface AccountSettingsWrapperState {
  costType?: CostTypes;
  currency?: string;
}

type AccountSettingsWrapperProps = AccountSettingsWrapperOwnProps &
  AccountSettingsWrapperDispatchProps &
  AccountSettingsWrapperStateProps &
  WrappedComponentProps;

class AccountSettingsWrapperBase extends React.Component<AccountSettingsWrapperProps> {
  protected defaultState: AccountSettingsWrapperState = {
    // TBD...
  };
  public state: AccountSettingsWrapperState = { ...this.defaultState };

  public componentDidMount() {
    this.updateAccountSettings();
  }

  public componentDidUpdate(prevProps: AccountSettingsWrapperProps) {
    const { accountSettings } = this.props;

    if (prevProps.accountSettings !== accountSettings) {
      // To do: Adjust meta properties when account-settings API is available
      const costType = accountSettings ? accountSettings.meta['cost-type'] : CostTypes.unblended;
      const currency = accountSettings ? accountSettings.meta.currency : 'USD';

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

    if (accountSettingsFetchStatus === FetchStatus.complete) {
      return children;
    }
    return null;
  }
}

const mapStateToProps = createMapStateToProps<AccountSettingsWrapperOwnProps, AccountSettingsWrapperStateProps>(
  state => {
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
  }
);

const mapDispatchToProps: AccountSettingsWrapperDispatchProps = {
  fetchAccountSettings: accountSettingsActions.fetchAccountSettings,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(AccountSettingsWrapperBase);
const AccountSettings = injectIntl(CostTypeConnect);

export { AccountSettings };
