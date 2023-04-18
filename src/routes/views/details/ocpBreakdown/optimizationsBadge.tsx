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
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

export interface OptimizationsBadgeOwnProps extends RouterComponentProps, WrappedComponentProps {
  // TBD...
}

export interface OptimizationsBadgeStateProps {
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

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.ros;

class OptimizationsBadgeBase extends React.Component<OptimizationsBadgeProps, OptimizationsBadgeState> {
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

    return <Badge screenReaderText={intl.formatMessage(messages.optimizationsDetails, { count })}>{count}</Badge>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OptimizationsBadgeOwnProps, OptimizationsBadgeStateProps>(
  (state, { router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    // Don't need pagination here
    const reportQuery: any = {
      ...(groupBy && {
        [groupBy]: groupByValue, // project filter
      }),
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

const mapDispatchToProps: OptimizationsBadgeDispatchProps = {
  fetchReport: rosActions.fetchRosReport,
};

const OptimizationsBadge = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationsBadgeBase)));

export { OptimizationsBadge };
