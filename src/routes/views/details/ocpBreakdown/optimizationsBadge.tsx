import { Badge } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import { parseQuery } from 'api/queries/rosQuery';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

export interface OptimizationsBadgeOwnProps extends RouterComponentProps, WrappedComponentProps {
  // TBD...
}

export interface OptimizationsBadgeStateProps {
  query?: RosQuery;
  report?: RosReport;
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
  OptimizationsBadgeDispatchProps;

const baseQuery: RosQuery = {
  limit: 10,
  offset: 0,
};

const reportPathsType = RosPathsType.recommendations;
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
    const { fetchReport, reportFetchStatus, reportQueryString } = this.props;

    if (reportFetchStatus !== FetchStatus.inProgress) {
      fetchReport(reportPathsType, reportType, reportQueryString);
    }
  };

  public render() {
    const { intl, report } = this.props;

    const count = report && report.meta ? report.meta.count : 0;

    return <Badge screenReaderText={intl.formatMessage(messages.optimizationsDetails, { count })}>{count}</Badge>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsBadgeOwnProps, OptimizationsBadgeStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const query = {
      ...(groupBy && {
        [groupBy]: groupByValue, // project filter
      }),
      limit: queryFromRoute.limit || baseQuery.limit,
      offset: queryFromRoute.offset || baseQuery.offset,
    };

    const reportQueryString = getQuery(query);
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

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationsBadge)));
