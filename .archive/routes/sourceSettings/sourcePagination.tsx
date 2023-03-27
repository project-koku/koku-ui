import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { FetchStatus } from 'store/common';
import { sourcesActions } from 'store/sourceSettings';

interface PaginationType {
  count: number;
  perPage: number;
  page: number;
}

interface Props {
  status: FetchStatus;
  pagination: PaginationType;
  fetchSources: (v) => void | typeof sourcesActions.fetchSources;
}

const SourcePagination: React.SFC<Props> = ({
  status,
  pagination,
  fetchSources,
}) => {
  if (status === FetchStatus.none) {
    return (
      <div style={{ width: '130px' }}>
        <Skeleton size={SkeletonSize.md} />
      </div>
    );
  }
  return (
    <Pagination
      itemCount={pagination.count}
      onPerPageSelect={(event, perPage: number) => {
        fetchSources({ offset: '0', limit: perPage.toString() });
      }}
      onSetPage={(event, pageNumber) => {
        const offset = (pageNumber - 1) * pagination.perPage;
        fetchSources({
          offset: offset.toString(),
          limit: pagination.perPage.toString(),
        });
      }}
      page={pagination.page}
      perPage={pagination.perPage}
      variant={PaginationVariant.top}
    />
  );
};

export default SourcePagination;
