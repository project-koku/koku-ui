import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { Query } from 'api/queries/query';
import { getQueryRoute } from 'api/queries/query';
import type { RecommendationReportData } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createMapStateToProps } from 'store/common';
import { getTimeFromNow } from 'utils/dates';
import { hasWarning } from 'utils/recomendations';

import { styles } from './optimizationsBreakdownHeader.styles';
import { OptimizationsBreakdownToolbar } from './optimizationsBreakdownToolbar';

interface OptimizationsBreakdownHeaderOwnProps {
  currentInterval?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  optimizationsURL?: string;
  queryFromRoute?: Query;
  report?: RecommendationReportData;
}

interface OptimizationsBreakdownHeaderStateProps {
  // TBD...
}

interface OptimizationsBreakdownHeaderState {}

type OptimizationsBreakdownHeaderProps = OptimizationsBreakdownHeaderOwnProps &
  OptimizationsBreakdownHeaderStateProps &
  WrappedComponentProps;

class OptimizationsBreakdownHeaderBase extends React.Component<
  OptimizationsBreakdownHeaderProps,
  OptimizationsBreakdownHeaderState
> {
  protected defaultState: OptimizationsBreakdownHeaderState = {};
  public state: OptimizationsBreakdownHeaderState = { ...this.defaultState };

  private buildOptimizationsLink = url => {
    const { queryFromRoute } = this.props;

    const newQuery = {
      ...(queryFromRoute.state && { state: queryFromRoute.state }),
    };
    return `${url}?${getQueryRoute(newQuery)}`;
  };

  private getBackToLink = () => {
    const { optimizationsURL, intl } = this.props;

    return (
      <Link to={this.buildOptimizationsLink(optimizationsURL)}>
        {intl.formatMessage(messages.breakdownBackToOptimizations)}
      </Link>
    );
  };

  private getDescription = () => {
    const { intl, report } = this.props;

    const clusterAlias = report && report.cluster_alias ? report.cluster_alias : undefined;
    const clusterUuid = report && report.cluster_uuid ? report.cluster_uuid : '';
    const cluster = clusterAlias ? clusterAlias : clusterUuid;

    const lastReported = report ? getTimeFromNow(report.last_reported) : '';
    const project = report && report.project ? report.project : '';
    const workload = report && report.workload ? report.workload : '';
    const workloadType = report && report.workload_type ? report.workload_type : '';

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

  public render() {
    const { currentInterval, isDisabled, onSelected, report } = this.props;

    const recommendations = report ? report.recommendations.duration_based : undefined;
    const showWarningIcon = hasWarning(recommendations);

    return (
      <header style={styles.header}>
        {this.getBackToLink()}
        <div style={styles.title}>
          <Title headingLevel="h1" size={TitleSizes['2xl']}>
            {report ? report.container : null}
          </Title>
          {showWarningIcon && (
            <span style={styles.warningIcon}>
              <ExclamationTriangleIcon color="orange" size="sm" />
            </span>
          )}
        </div>
        <div style={styles.description}>{this.getDescription()}</div>
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
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<
  OptimizationsBreakdownHeaderOwnProps,
  OptimizationsBreakdownHeaderStateProps
>(() => {
  return {
    // TBD...
  };
});

const OptimizationsBreakdownHeader = injectIntl(connect(mapStateToProps, {})(OptimizationsBreakdownHeaderBase));

export { OptimizationsBreakdownHeader };
