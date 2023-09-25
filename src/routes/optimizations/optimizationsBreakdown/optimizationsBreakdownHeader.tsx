import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import type { RecommendationReportData } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { getTimeFromNow } from 'utils/dates';

import { styles } from './optimizationsBreakdownHeader.styles';
import { OptimizationsBreakdownToolbar } from './optimizationsBreakdownToolbar';

interface OptimizationsBreakdownHeaderOwnProps {
  currentInterval?: string;
  isDisabled?: boolean;
  onSelected?: (value: string) => void;
  query?: Query;
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

    return (
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
            {report ? report.container : null}
          </Title>
          {this.getDescription()}
          <OptimizationsBreakdownToolbar
            currentInterval={currentInterval}
            isDisabled={isDisabled}
            recommendations={report ? report.recommendations.duration_based : undefined}
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
