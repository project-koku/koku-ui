import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { PageHeader, PageHeaderTitle } from '../../../../init';
import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  pathname?: string;
  title?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps;

const NotAuthorized = ({ pathname, title }: NotAuthorizedProps) => {
  return (
    <>
      {title && (
        <PageHeader>
          <PageHeaderTitle title={title} />
        </PageHeader>
      )}
      <PageSection hasBodyWrapper={false}>
        <Card>
          <CardBody>
            <NotAuthorizedState pathname={pathname} />
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default NotAuthorized;
