import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import type { PaginationProps } from '@patternfly/react-core';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import type { RootState } from '../../../../store';
import { costModelsSelectors } from '../../../../store/costModels';
import type { RouterComponentProps } from '../../../../utils/router';
import { withRouter } from '../../../../utils/router';
import { initialCostModelsQuery, limitTransform, offsetTransform, stringifySearch } from './utils/query';

type BottomPaginationBaseProps = Omit<PaginationProps, 'ref'> & WrappedComponentProps;

const BottomPaginationBase: React.FC<BottomPaginationBaseProps> = props => {
  const {
    variant,
    intl = defaultIntl, // for testing
    itemCount,
    page,
    perPage,
    onSetPage,
    onPerPageSelect,
  } = props;
  return (
    <Pagination
      onPerPageSelect={onPerPageSelect}
      onSetPage={onSetPage}
      variant={variant}
      itemCount={itemCount}
      page={page}
      perPage={perPage}
      titles={{
        paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
          title: intl.formatMessage(messages.costModelsDetailsTitle),
          placement: 'bottom',
        }),
      }}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const { count, page, perPage } = costModelsSelectors.pagination(state);
  const query: { [p: string]: string } = costModelsSelectors.query(state);
  return {
    query,
    count,
    page,
    perPage,
  };
};

const mergeProps = (stateProps: ReturnType<typeof mapStateToProps>, dispatchProps, ownProps: RouterComponentProps) => {
  const { router } = ownProps;
  const { count, page, perPage, query } = stateProps;
  return {
    itemCount: count,
    page,
    perPage,
    variant: PaginationVariant.bottom,
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
  };
};

export const CostModelsBottomPagination = withRouter(
  connect(mapStateToProps, undefined, mergeProps)(injectIntl(BottomPaginationBase))
);
