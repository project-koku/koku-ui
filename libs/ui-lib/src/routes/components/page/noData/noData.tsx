import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { PageHeader, PageHeaderTitle } from '../../../../init';
import { NoDataState } from './noDataState';

interface NoDataOwnProps {
  detailsComponent?: React.ReactNode;
  isPageSection?: boolean;
  showReload?: boolean;
  title?: string;
}

type NoDataProps = NoDataOwnProps;

const NoData = ({ detailsComponent, isPageSection = true, showReload, title }: NoDataProps) => {
  const content = (
    <Card>
      <CardBody>
        <NoDataState detailsComponent={detailsComponent} showReload={showReload} />
      </CardBody>
    </Card>
  );
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      {isPageSection ? <PageSection hasBodyWrapper={false}>{content}</PageSection> : content}
    </>
  );
};

export default NoData;
