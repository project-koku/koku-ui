import type { PaginationProps } from '@patternfly/react-core';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import type { CostModelsQuery } from './query';
import { initialCostModelsQuery, limitTransform, offsetTransform, stringifySearch } from './query';

interface CostModelsFilterSelectorOwnProps {
  filterType?: any;
  updateFilterType?: any;
}

type CostModelsFilterSelectorProps = CostModelsFilterSelectorOwnProps & WrappedComponentProps & RouterComponentProps;

const costModelsFilterSelectorMapStateToProps = (state: RootState) => {
  return {
    filterType: costModelsSelectors.currentFilterType(state),
  };
};

const costModelsFilterSelectorMapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateFilterType: (value: string) => {
      dispatch(
        costModelsActions.updateFilterToolbar({
          currentFilterType: value,
        })
      );
    },
  };
};

const costModelsFilterMergeProps = (
  stateProps: ReturnType<typeof costModelsFilterSelectorMapStateToProps>,
  dispatchProps: ReturnType<typeof costModelsFilterSelectorMapDispatchToProps>,
  ownProps: WrappedComponentProps
) => {
  const { intl = defaultIntl } = ownProps; // Default required for testing
  const { filterType } = stateProps;
  return {
    filterType,
    intl,
    updateFilterType: dispatchProps.updateFilterType,
  };
};

const CostModelsFilterSelectorBase: React.FC<CostModelsFilterSelectorProps> = ({
  filterType,
  intl,
  updateFilterType,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const options = [
    <SelectOption key="name" value="name">
      {intl.formatMessage(messages.names, { count: 1 })}
    </SelectOption>,
    <SelectOption key="description" value="description">
      {intl.formatMessage(messages.description)}
    </SelectOption>,
    <SelectOption key="sourceType" value="sourceType">
      {intl.formatMessage(messages.sourceType)}
    </SelectOption>,
  ];
  return (
    <Select
      isOpen={isOpen}
      onSelect={(_evt, value) => {
        updateFilterType(value);
        setIsOpen(false);
      }}
      onToggle={(_evt, isExpanded) => setIsOpen(isExpanded)}
      selections={filterType}
      toggleIcon={<FilterIcon />}
      variant={SelectVariant.single}
    >
      {options}
    </Select>
  );
};
const CostModelsFilterSelectorConnect = connect(
  costModelsFilterSelectorMapStateToProps,
  costModelsFilterSelectorMapDispatchToProps,
  costModelsFilterMergeProps
)(CostModelsFilterSelectorBase);
export const CostModelsFilterSelector = injectIntl(withRouter(CostModelsFilterSelectorConnect));

const topPaginationMapStateToProps = (state: RootState) => {
  const { count, page, perPage } = costModelsSelectors.pagination(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { count, page, perPage, query };
};

const topPaginationMergeProps = (
  stateProps: ReturnType<typeof topPaginationMapStateToProps>,
  dispatchProps,
  ownProps: RouterComponentProps
) => {
  const { router } = ownProps;
  const { count, page, perPage, query } = stateProps;
  return {
    isCompact: true,
    itemCount: count,
    page,
    perPage,
    variant: PaginationVariant.top,
    onSetPage: (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number, newPerPage: number) => {
      router.navigate(
        stringifySearch({
          ...initialCostModelsQuery,
          ...query,
          offset: offsetTransform(newPage, newPerPage),
        })
      );
    },
    onPerPageSelect: (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
      router.navigate(
        stringifySearch({
          ...initialCostModelsQuery,
          ...query,
          limit: limitTransform(newPerPage),
          offset: 0,
        })
      );
    },
  } as PaginationProps;
};

export const CostModelsTopPagination = withRouter(
  connect(topPaginationMapStateToProps, undefined, topPaginationMergeProps)(Pagination)
);
