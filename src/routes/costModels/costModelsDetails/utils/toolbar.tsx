import {
  Pagination,
  PaginationProps,
  PaginationVariant,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/esm/icons/filter-icon';
import { intl as defaultIntl } from 'components/i18n';
import HookIntoProps from 'hook-into-props';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { CostModelsQuery, initialCostModelsQuery, limitTransform, offsetTransform, stringifySearch } from './query';
import { Opener } from './types';

const selectorMapStateToProps = (state: RootState) => {
  return {
    filterType: costModelsSelectors.currentFilterType(state),
  };
};

const selectorMapDispatchToProps = (dispatch: Dispatch) => {
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

const selectorMergeProps = (
  stateProps: ReturnType<typeof selectorMapStateToProps>,
  dispatchProps: ReturnType<typeof selectorMapDispatchToProps>,
  ownProps: Opener & WrappedComponentProps
) => {
  const { intl = defaultIntl } = ownProps; // Default required for testing
  const options = [
    <SelectOption key="name" value="name">
      {intl.formatMessage(messages.names, { count: 1 })}
    </SelectOption>,
    <SelectOption key="description" value="description">
      {intl.formatMessage(messages.description)}
    </SelectOption>,
    <SelectOption key="sourceType" value="sourceType">
      {intl.formatMessage(messages.costModelsSourceType)}
    </SelectOption>,
  ];
  return {
    variant: SelectVariant.single,
    selections: stateProps.filterType,
    onToggle: ownProps.setIsOpen,
    isOpen: ownProps.isOpen,
    onSelect: (_event, value: string) => {
      dispatchProps.updateFilterType(value);
      ownProps.setIsOpen(false);
    },
    children: options,
    toggleIcon: <FilterIcon />,
  } as SelectProps;
};

export const CostModelsFilterSelector = HookIntoProps(() => {
  const [isOpen, setIsOpen] = React.useState(false);
  return { isOpen, setIsOpen };
})(injectIntl(connect(selectorMapStateToProps, selectorMapDispatchToProps, selectorMergeProps)(Select)));

const topPaginationMapStateToProps = (state: RootState) => {
  const { count, page, perPage } = costModelsSelectors.pagination(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return { count, page, perPage, query };
};

const topPaginationMergeProps = (
  stateProps: ReturnType<typeof topPaginationMapStateToProps>,
  dispatchProps,
  ownProps: RouteComponentProps
) => {
  const {
    history: { push },
  } = ownProps;
  const { count, page, perPage, query } = stateProps;
  return {
    isCompact: true,
    itemCount: count,
    page,
    perPage,
    variant: PaginationVariant.top,
    onSetPage: (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number, newPerPage: number) => {
      push(
        stringifySearch({
          ...initialCostModelsQuery,
          ...query,
          offset: offsetTransform(newPage, newPerPage),
        })
      );
    },
    onPerPageSelect: (_evt: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number) => {
      push(
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
