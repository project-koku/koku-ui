import {
  Pagination,
  PaginationProps,
  PaginationVariant,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
} from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons/dist/js/icons/filter-icon';
import HookIntoProps from 'hook-into-props';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
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
  ownProps: Opener & WithTranslation
) => {
  const { t } = ownProps;
  const options = [
    <SelectOption key="name" value="name">
      {t('page_cost_models.name')}
    </SelectOption>,
    <SelectOption key="description" value="description">
      {t('page_cost_models.description')}
    </SelectOption>,
    <SelectOption key="sourceType" value="sourceType">
      {t('page_cost_models.source_type')}
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
})(withTranslation()(connect(selectorMapStateToProps, selectorMapDispatchToProps, selectorMergeProps)(Select)));

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
