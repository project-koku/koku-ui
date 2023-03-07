import './rosSummary.scss';

import { Card, CardBody, CardTitle, Skeleton, Title, TitleSizes } from '@patternfly/react-core';
import type { Ros } from 'api/ros/ros';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { FetchStatus } from 'store/common';
import { formatPath } from 'utils/paths';
import { skeletonWidth } from 'utils/skeleton';

export interface RosSummaryProps extends WrappedComponentProps {
  ros: Ros;
  status: number;
  title: MessageDescriptor;
}

const RosSummaryBase: React.FC<RosSummaryProps> = ({ intl, title, status }) => {
  const count = 3;
  const description = intl.formatMessage(messages.rosRecommendationsDetails, { count });
  return (
    <Card className="summary">
      <CardTitle>
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(title)}
        </Title>
      </CardTitle>
      <CardBody>
        {status === FetchStatus.inProgress ? (
          <>
            <Skeleton width="16%" />
            <Skeleton className="skeleton" width={skeletonWidth.md} />
          </>
        ) : count > 0 ? (
          <Link to={formatPath(routes.recommendations.path)}>{description}</Link>
        ) : (
          description
        )}
      </CardBody>
    </Card>
  );
};

const RosSummary = injectIntl(RosSummaryBase);

export { RosSummary };
