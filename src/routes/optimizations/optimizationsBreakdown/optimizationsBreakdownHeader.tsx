import {
  Icon,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { RecommendationReportData } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'routes';
import { getTimeFromNow } from 'utils/dates';
import { hasWarning } from 'utils/recomendations';

import { styles } from './optimizationsBreakdownHeader.styles';
import { OptimizationsBreakdownToolbar } from './optimizationsBreakdownToolbar';

interface OptimizationsBreakdownHeaderOwnProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  currentInterval?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  report?: RecommendationReportData;
}

type OptimizationsBreakdownHeaderProps = OptimizationsBreakdownHeaderOwnProps;

const OptimizationsBreakdownHeader: React.FC<OptimizationsBreakdownHeaderProps> = ({
  breadcrumbLabel,
  breadcrumbPath = routes.optimizationsDetails,
  currentInterval,
  isDisabled,
  onSelected,
  report,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const recommendations = report ? report.recommendations.duration_based : undefined;
  const showWarningIcon = hasWarning(recommendations);

  const getBackToLink = () => {
    return (
      <Link to={breadcrumbPath} state={location.state}>
        {breadcrumbLabel ? breadcrumbLabel : intl.formatMessage(messages.breakdownBackToOptimizations)}
      </Link>
    );
  };

  const getDescription = () => {
    const clusterAlias = report?.cluster_alias ? report.cluster_alias : undefined;
    const clusterUuid = report?.cluster_uuid ? report.cluster_uuid : '';
    const cluster = clusterAlias ? clusterAlias : clusterUuid;

    const lastReported = report ? getTimeFromNow(report.last_reported) : '';
    const project = report?.project ? report.project : '';
    const workload = report?.workload ? report.workload : '';
    const workloadType = report?.workload_type ? report.workload_type : '';

    return (
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.optimizationsValues, { value: 'last_reported' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{lastReported}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.optimizationsValues, { value: 'cluster' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{cluster}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.optimizationsValues, { value: 'project' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{project}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.optimizationsValues, { value: 'workload_type' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{workloadType}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.optimizationsValues, { value: 'workload' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{workload}</TextListItem>
        </TextList>
      </TextContent>
    );
  };

  return (
    <header style={styles.header}>
      {getBackToLink()}
      <div style={styles.title}>
        <Title headingLevel="h1" size={TitleSizes['2xl']}>
          {report ? report.container : null}
        </Title>
        {showWarningIcon && (
          <span style={styles.warningIcon}>
            <Icon status="warning">
              <ExclamationTriangleIcon />
            </Icon>
          </span>
        )}
      </div>
      <div style={styles.description}>{getDescription()}</div>
      <div style={styles.toolbar}>
        <OptimizationsBreakdownToolbar
          currentInterval={currentInterval}
          isDisabled={isDisabled}
          recommendations={recommendations}
          onSelected={onSelected}
        />
      </div>
    </header>
  );
};

export { OptimizationsBreakdownHeader };
