import { PaginationProps } from '@patternfly/react-core';
import { stringify } from 'qs';
import { connect, Dispatch } from 'react-redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { PaginationToolbarTemplate } from '../components/paginationToolbarTemplate';

type OwnProps = Pick<PaginationProps, 'variant'>;

const CostModelsPagination = connect(
  (state: RootState) => {
    return {
      pagination: costModelsSelectors.pagination(state),
      status: costModelsSelectors.status(state),
      query: costModelsSelectors.query(state),
    };
  },
  (dispatch: Dispatch) => {
    return {
      fetch: (query: string) => costModelsActions.fetchCostModels(query)(dispatch),
    };
  },
  (stateProps, dispatchProps, ownProps: OwnProps) => {
    return {
      itemCount: stateProps.pagination.count,
      perPage: stateProps.pagination.perPage,
      page: stateProps.pagination.page,
      variant: ownProps.variant,
      onSetPage: (_evt, pageNumber: number) => {
        const offset = (pageNumber - 1) * stateProps.pagination.perPage;
        const newQuery = {
          ...stateProps.query,
          offset: offset.toString(),
          limit: stateProps.pagination.perPage.toString(),
        };
        dispatchProps.fetch(stringify(newQuery));
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onPerPageSelect: (_evt, perPage: number, _page: number) => {
        const newQuery = {
          ...stateProps.query,
          offset: '0',
          limit: perPage.toString(),
        };
        dispatchProps.fetch(stringify(newQuery));
      },
    };
  }
)(PaginationToolbarTemplate);

export default CostModelsPagination;
