import { getQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RecommendationReport } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

export interface DetailsOptimizationOwnProps {
  project?: string;
}

export interface DetailsOptimizationStateProps {
  query?: RosQuery;
  report?: RecommendationReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface DetailsOptimizationDispatchProps {
  fetchReport: typeof rosActions.fetchRosReport;
}

interface DetailsOptimizationState {}

type DetailsOptimizationProps = DetailsOptimizationOwnProps &
  DetailsOptimizationStateProps &
  DetailsOptimizationDispatchProps &
  WrappedComponentProps;

const reportPathsType = RosPathsType.recommendationList;
const reportType = RosType.ros;

class DetailsOptimization extends React.Component<DetailsOptimizationProps, DetailsOptimizationState> {
  protected defaultState: DetailsOptimizationState = {
    // TBD...
  };
  public state: DetailsOptimizationState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  private updateReport = () => {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;

    // Todo: Add link to breakdown page
    return <span>{count}</span>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsOptimizationOwnProps, DetailsOptimizationStateProps>(
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

const mapDispatchToProps: DetailsOptimizationDispatchProps = {
  fetchReport: rosActions.fetchRosReport,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DetailsOptimization));
