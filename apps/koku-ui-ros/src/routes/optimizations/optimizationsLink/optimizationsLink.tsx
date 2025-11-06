import { getQuery } from 'api/queries/query';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';

export interface OptimizationsLinkOwnProps {
  cluster?: string | string[];
  linkPath?: string;
  linkState?: any;
  project?: string | string[];
}

export interface OptimizationsLinkStateProps {
  report?: RosReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type OptimizationsLinkProps = OptimizationsLinkOwnProps & OptimizationsLinkStateProps;

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.ros;

const OptimizationsLink: React.FC<OptimizationsLinkProps> = ({
  cluster,
  linkPath,
  linkState,
  project,
}: OptimizationsLinkOwnProps) => {
  const { report } = useMapToProps({ cluster, project });

  const count = report?.meta ? report.meta.count : 0;

  if (count === 0) {
    return count;
  }
  return (
    <Link
      to={linkPath}
      state={{
        ...(linkState && linkState),
      }}
    >
      {count}
    </Link>
  );
};

const useMapToProps = ({ cluster, project }: OptimizationsLinkOwnProps): OptimizationsLinkStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery = {
    ...(cluster && { cluster }), // Flattened cluster filter
    ...(project && { project }), // Flattened project filter
  };
  const reportQueryString = getQuery(reportQuery);
  const report: any = useSelector((state: RootState) =>
    rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if ((cluster || project) && !reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRosReport(reportPathsType, reportType, reportQueryString));
    }
  }, [cluster, project, reportQueryString]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsLink;
