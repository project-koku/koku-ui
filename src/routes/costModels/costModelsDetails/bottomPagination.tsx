import {
  Pagination,
  PaginationProps,
  PaginationVariant,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from '@patternfly/react-core';
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { RootState } from 'store';
import { costModelsSelectors } from 'store/costModels';

import {
  CostModelsQuery,
  initialCostModelsQuery,
  limitTransform,
  offsetTransform,
  stringifySearch,
} from './utils/query';

function BottomPaginationBase(props: Omit<PaginationProps, 'ref'>): JSX.Element {
  const { variant, itemCount, page, perPage, onSetPage, onPerPageSelect } = props;
  return (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem variant={ToolbarItemVariant.pagination}>
          <Pagination
            onPerPageSelect={onPerPageSelect}
            onSetPage={onSetPage}
            variant={variant}
            itemCount={itemCount}
            page={page}
            perPage={perPage}
            titles={{
              paginationTitle: `bottom pagination`,
            }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
}

const mapStateToProps = (state: RootState) => {
  const { count, page, perPage } = costModelsSelectors.pagination(state);
  const query: Partial<CostModelsQuery> = costModelsSelectors.query(state);
  return {
    query,
    count,
    page,
    perPage,
  };
};

const mergeProps = (stateProps: ReturnType<typeof mapStateToProps>, dispatchProps, ownProps: RouteComponentProps) => {
  const {
    history: { push },
  } = ownProps;
  const { count, page, perPage, query } = stateProps;
  return {
    itemCount: count,
    page,
    perPage,
    variant: PaginationVariant.bottom,
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
  };
};

const CostModelsBottomPagination = withRouter(connect(mapStateToProps, undefined, mergeProps)(BottomPaginationBase));

export default CostModelsBottomPagination;
