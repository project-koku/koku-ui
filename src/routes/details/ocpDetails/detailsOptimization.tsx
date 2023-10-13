import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getBreakdownPath } from 'routes/utils/paths';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

export interface DetailsOptimizationOwnProps {
  basePath?: string;
  breadcrumbPath?: string;
  project?: string;
  query?: Query;
}

export interface DetailsOptimizationStateProps {
  report?: RosReport;
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
  RouterComponentProps;

const reportPathsType = RosPathsType.recommendations;
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

  private getBreakdownLink = count => {
    const { basePath, breadcrumbPath, project, query, router } = this.props;

    if (count === 0 || project === undefined) {
      return count;
    }
    return (
      <Link
        to={getBreakdownPath({
          basePath,
          groupBy: 'project',
          id: project,
          isOptimizationsTab: true,
          title: project,
        })}
        state={{
          ...(router.location.state && router.location.state),
          details: {
            ...(query && query),
            breadcrumbPath,
          },
        }}
      >
        {count}
      </Link>
    );
  };

  public render() {
    const { report } = this.props;

    const count = report?.meta ? report.meta.count : 0;

    // Todo: Add link to breakdown page
    return <span>{this.getBreakdownLink(count)}</span>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsOptimizationOwnProps, DetailsOptimizationStateProps>(
  (state, { project }) => {
    const reportQuery = {
      project, // project filter
    };
    const reportQueryString = getQuery(reportQuery);
    const report = rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString);
    const reportError = rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString);

    return {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailsOptimization));
