import { CostType } from 'api/costType';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { UserAccess, UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costTypeActions, costTypeSelectors } from 'store/costType';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import { allUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { CostTypes } from 'utils/localStorage';
import { isAwsAvailable } from 'utils/userAccess';

interface CostTypeWrapperOwnProps {
  children?: React.ReactNode;
}

interface CostTypeWrapperDispatchProps {
  fetchCostType?: typeof costTypeActions.fetchCostType;
}

interface CostTypeWrapperStateProps {
  awsProviders: Providers;
  awsProvidersFetchStatus: FetchStatus;
  awsProvidersQueryString: string;
  costType: CostType;
  costTypeError: AxiosError;
  costTypeFetchStatus?: FetchStatus;
  userAccess: UserAccess;
  userAccessError: AxiosError;
  userAccessFetchStatus: FetchStatus;
  userAccessQueryString: string;
}

interface CostTypeWrapperState {
  currentCostType?: CostTypes;
}

type CostTypeWrapperProps = CostTypeWrapperOwnProps &
  CostTypeWrapperDispatchProps &
  CostTypeWrapperStateProps &
  WrappedComponentProps;

class CostTypeWrapperBase extends React.Component<CostTypeWrapperProps> {
  protected defaultState: CostTypeWrapperState = {
    // TBD...
  };
  public state: CostTypeWrapperState = { ...this.defaultState };

  public componentDidMount() {
    this.updateCostType();
  }

  public componentDidUpdate(prevProps: CostTypeWrapperProps) {
    const { awsProviders, costType } = this.props;

    if (prevProps.awsProviders !== awsProviders) {
      this.updateCostType();
    } else if (prevProps.costType !== costType) {
      const currentCostType = costType ? costType.meta['cost-type'] : CostTypes.unblended;

      this.setState({
        currentCostType,
      });
    }
  }

  private isAwsAvailable = () => {
    const { awsProviders, userAccess } = this.props;
    return isAwsAvailable(userAccess, awsProviders);
  };

  private updateCostType = () => {
    const { costTypeFetchStatus, fetchCostType } = this.props;

    if (this.isAwsAvailable() && costTypeFetchStatus !== FetchStatus.inProgress) {
      fetchCostType();
    }
  };

  public render() {
    const { awsProvidersFetchStatus, children } = this.props;
    const { currentCostType } = this.state;

    if (!this.isAwsAvailable() && awsProvidersFetchStatus === FetchStatus.complete) {
      return children;
    }
    return currentCostType ? children : null;
  }
}

const mapStateToProps = createMapStateToProps<CostTypeWrapperOwnProps, CostTypeWrapperStateProps>(state => {
  const awsProvidersQueryString = getProvidersQuery(awsProvidersQuery);
  const awsProviders = providersSelectors.selectProviders(state, ProviderType.aws, awsProvidersQueryString);
  const awsProvidersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    awsProvidersQueryString
  );

  const costType = costTypeSelectors.selectCostType(state);
  const costTypeError = costTypeSelectors.selectCostTypeError(state);
  const costTypeFetchStatus = costTypeSelectors.selectCostTypeFetchStatus(state);

  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);
  const userAccessError = userAccessSelectors.selectUserAccessError(state, UserAccessType.all, userAccessQueryString);
  const userAccessFetchStatus = userAccessSelectors.selectUserAccessFetchStatus(
    state,
    UserAccessType.all,
    userAccessQueryString
  );

  return {
    awsProviders,
    awsProvidersFetchStatus,
    awsProvidersQueryString,
    costType,
    costTypeError,
    costTypeFetchStatus,
    userAccess,
    userAccessError,
    userAccessFetchStatus,
    userAccessQueryString,
  };
});

const mapDispatchToProps: CostTypeWrapperDispatchProps = {
  fetchCostType: costTypeActions.fetchCostType,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(CostTypeWrapperBase);
const CostTypeWrapper = injectIntl(CostTypeConnect);

export { CostTypeWrapper };
