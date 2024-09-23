import { PageSection } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import React from 'react';

import { NoDataState } from './noDataState';

interface NoDataOwnProps {
  detailsComponent?: React.ReactNode;
  showReload?: boolean;
  title?: string;
}

type NoDataProps = NoDataOwnProps;

const NoData = ({ detailsComponent, showReload, title }: NoDataProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <NoDataState detailsComponent={detailsComponent} showReload={showReload} />
      </PageSection>
    </>
  );
};

export default NoData;
