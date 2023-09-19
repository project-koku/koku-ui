import './optimizationsSummary.scss';

import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Popover,
  Skeleton,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import type { RosReport } from 'api/ros/ros';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { skeletonWidth } from 'routes/utils/skeleton';
import { FetchStatus } from 'store/common';
import { formatPath } from 'utils/paths';

import { styles } from './optimizations.styles';

export interface OptimizationsSummaryProps extends WrappedComponentProps {
  report: RosReport;
  status: number;
  title: MessageDescriptor;
}

const OptimizationsSummaryBase: React.FC<OptimizationsSummaryProps> = ({ intl, report, status, title }) => {
  const count = report && report.meta ? report.meta.count : 0;
  const description = intl.formatMessage(messages.optimizationsDetails, { count });
  return (
    <Card className="summary">
      <CardTitle>
        <Title headingLevel="h2" size={TitleSizes.lg}>
          {intl.formatMessage(title)}
          <span style={styles.infoIcon}>
            <Popover
              aria-label={intl.formatMessage(messages.optimizationsInfoArialLabel)}
              enableFlip
              bodyContent={<p style={styles.infoTitle}>{intl.formatMessage(messages.optimizationsInfo)}</p>}
            >
              <Button
                aria-label={intl.formatMessage(messages.optimizationsInfoButtonArialLabel)}
                variant={ButtonVariant.plain}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </span>
        </Title>
      </CardTitle>
      <CardBody>
        {status === FetchStatus.inProgress ? (
          <>
            <Skeleton width="16%" />
            <Skeleton className="skeleton" width={skeletonWidth.md} />
          </>
        ) : count > 0 ? (
          <Link to={formatPath(routes.optimizationsDetails.path)}>{description}</Link>
        ) : (
          description
        )}
      </CardBody>
    </Card>
  );
};

const OptimizationsSummary = injectIntl(OptimizationsSummaryBase);

export default OptimizationsSummary;
