import { Pagination, PaginationVariant } from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import React from 'react';
import { FetchStatus } from 'store/common';

interface PaginationType {
  count: number;
  perPage: number;
  page: number;
}

interface Props {
  status: FetchStatus;
  pagination: PaginationType;
  fetch: (v) => void;
}

const SourcePagination: React.SFC<Props> = ({ status, pagination, fetch }) => {
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
        fetch({ offset: '0', limit: perPage.toString() });
      }}
      onSetPage={(event, pageNumber) => {
        const offset = (pageNumber - 1) * pagination.perPage;
        fetch({
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
