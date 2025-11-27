import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { PaginationProps } from '@patternfly/react-core';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import type { RootState } from '../../../../../store';
import { costModelsActions, costModelsSelectors } from '../../../../../store/costModels';
import type { RouterComponentProps } from '../../../../../utils/router';
import { withRouter } from '../../../../../utils/router';
import type { SelectWrapperOption } from '../../../../components/selectWrapper';
import { SelectWrapper } from '../../../../components/selectWrapper';
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
  const handleOnSelect = (_evt, selection: SelectWrapperOption) => {
    updateFilterType(selection.value);
  };

  const selectOptions: SelectWrapperOption[] = [
    {
      toString: () => intl.formatMessage(messages.names, { count: 1 }),
      value: 'name',
    },
    {
      toString: () => intl.formatMessage(messages.description),
      value: 'description',
    },
    {
      toString: () => intl.formatMessage(messages.sourceType),
      value: 'sourceType',
    },
  ];
  const selection = selectOptions.find(option => option.value === filterType);

  return (
    <SelectWrapper
      id="cost-models-details-select"
      onSelect={handleOnSelect}
      options={selectOptions}
      selection={selection}
      toggleIcon={<FilterIcon />}
    />
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
