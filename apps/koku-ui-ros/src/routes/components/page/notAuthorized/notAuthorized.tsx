import PageHeader from '@patternfly/react-component-groups/dist/esm/PageHeader';
import { Card, CardBody, PageSection } from '@patternfly/react-core';
import React from 'react';

import { NotAuthorizedState } from './notAuthorizedState';

interface NotAuthorizedOwnProps {
  pathname?: string;
  title?: string;
}

type NotAuthorizedProps = NotAuthorizedOwnProps;

const NotAuthorized = ({ pathname, title }: NotAuthorizedProps) => {
  return (
    <>
      {title && <PageHeader title={title} />}
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

export { NotAuthorized };
