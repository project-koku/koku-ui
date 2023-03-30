import { Badge } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RecommendationReport } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

export interface OptimizationsBadgeOwnProps {
  project?: string;
}

export interface OptimizationsBadgeStateProps {
  query?: RosQuery;
  report?: RecommendationReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface OptimizationsBadgeDispatchProps {
  fetchReport: typeof rosActions.fetchRosReport;
}

interface OptimizationsBadgeState {}

type OptimizationsBadgeProps = OptimizationsBadgeOwnProps &
  OptimizationsBadgeStateProps &
  OptimizationsBadgeDispatchProps &
  WrappedComponentProps;

const reportPathsType = RosPathsType.recommendation;
const reportType = RosType.ros;

class OptimizationsBadge extends React.Component<OptimizationsBadgeProps, OptimizationsBadgeState> {
  protected defaultState: OptimizationsBadgeState = {
    // TBD...
  };
  public state: OptimizationsBadgeState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  private updateReport = () => {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { intl, report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;

    return <Badge screenReaderText={intl.formatMessage(messages.recommendationsDetails, { count })}>{count}</Badge>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsBadgeOwnProps, OptimizationsBadgeStateProps>(
  (state, { project }) => {
    const query = {
      project, // project filter
    };
    const reportQueryString = getQuery({
      ...query,
    });
    const report = rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString);
    const reportError = rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString);

    return {
      query,
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    } as any;
  }
);

const mapDispatchToProps: OptimizationsBadgeDispatchProps = {
  fetchReport: rosActions.fetchRosReport,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OptimizationsBadge));
