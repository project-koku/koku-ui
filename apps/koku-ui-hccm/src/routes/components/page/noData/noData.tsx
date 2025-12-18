import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

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
      {title && <PageHeader title={title} />}
      {isPageSection ? <PageSection hasBodyWrapper={false}>{content}</PageSection> : content}
    </>
  );
};

export default NoData;
