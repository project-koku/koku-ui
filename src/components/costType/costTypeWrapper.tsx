import { CostType } from 'api/costType';
import { AxiosError } from 'axios';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costTypeActions, costTypeSelectors } from 'store/costType';
import { CostTypes } from 'utils/localStorage';

interface CostTypeWrapperOwnProps {
  children?: React.ReactNode;
}

interface CostTypeWrapperDispatchProps {
  fetchCostType?: typeof costTypeActions.fetchCostType;
}

interface CostTypeWrapperStateProps {
  costType: CostType;
  costTypeError: AxiosError;
  costTypeFetchStatus?: FetchStatus;
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
    const { costTypeFetchStatus, fetchCostType } = this.props;

    if (costTypeFetchStatus !== FetchStatus.inProgress) {
      fetchCostType();
    }
  }

  public componentDidUpdate(prevProps: CostTypeWrapperProps, prevState: CostTypeWrapperState) {
    const { costType } = this.props;

    if (prevProps.costType !== costType) {
      const currentCostType = costType ? costType.meta['cost-type'] : CostTypes.unblended;

      this.setState({
        currentCostType,
      });
    }
  }

  public render() {
    const { children } = this.props;
    const { currentCostType } = this.state;

    return currentCostType ? children : null;
  }
}

const mapStateToProps = createMapStateToProps<CostTypeWrapperOwnProps, CostTypeWrapperStateProps>(state => {
  const costType = costTypeSelectors.selectCostType(state);
  const costTypeError = costTypeSelectors.selectCostTypeError(state);
  const costTypeFetchStatus = costTypeSelectors.selectCostTypeFetchStatus(state);

  return {
    costType,
    costTypeError,
    costTypeFetchStatus,
  };
});

const mapDispatchToProps: CostTypeWrapperDispatchProps = {
  fetchCostType: costTypeActions.fetchCostType,
};

const CostTypeConnect = connect(mapStateToProps, mapDispatchToProps)(CostTypeWrapperBase);
const CostTypeWrapper = injectIntl(CostTypeConnect);

export { CostTypeWrapper };
