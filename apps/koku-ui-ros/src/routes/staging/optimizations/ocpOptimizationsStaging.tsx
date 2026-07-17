import { PageSection } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { RosReport } from 'api/ros/ros';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { NotConfigured } from 'routes/components/page/notConfigured';
import { LoadingState } from 'routes/components/state/loadingState';
import { OptimizationsOcpBreakdown } from 'routes/optimizations/optimizationsOcpBreakdown';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { formatPath } from 'utils/paths';

interface OcpOptimizationsStagingOwnProps {
  // TBD...
}

export interface OptimizationsProjectsTableStateProps {
  report: RosReport;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
}

type OcpOptimizationsStagingProps = OcpOptimizationsStagingOwnProps;

const reportPathsType = RosPathsType.recommendations;
const reportType = RosType.namespace as any;

const OcpOptimizationsStaging: React.FC<OcpOptimizationsStagingProps> = () => {
  const intl = useIntl();
  const location = useLocation();

  const { report, reportError, reportFetchStatus } = useMapToProps();

  const project = report?.data?.[0]?.project;

  if (reportError) {
    return <NotAvailable title={intl.formatMessage(messages.optimizations)} />;
  }

  if (reportFetchStatus === FetchStatus.inProgress) {
    return (
      <PageSection>
        <LoadingState
          body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
          heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
        />
      </PageSection>
    );
  }

  if (reportFetchStatus === FetchStatus.complete && !project) {
    return <NotConfigured />;
  }

  return (
    <PageSection>
      <OptimizationsOcpBreakdown
        breadcrumbLabel={intl.formatMessage(messages.breakdownBackToOptimizations)}
        breadcrumbPath={`${formatPath(routes.ocpOptimizations.path)}${location.search}`}
        linkPath={formatPath(routes.ocpOptimizationsBreakdown.path)}
        linkState={{
          ...(location?.state || {}),
        }}
        project={project}
        queryStateName="ocpOptimizationsState"
      />
    </PageSection>
  );
};

// For API spec, see https://github.com/RedHatInsights/ros-ocp-backend/blob/main/openapi.json
const useMapToProps = (): OptimizationsProjectsTableStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQuery = {
    // TBD...
  };

  const reportQueryString = getQuery(reportQuery);
  const report = useSelector((state: RootState) =>
    rosSelectors.selectRos(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    rosSelectors.selectRosFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    rosSelectors.selectRosError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRosReport(reportPathsType, reportType, reportQueryString));
    }
  }, []);

  return {
    report,
    reportError,
    reportFetchStatus,
  };
};

export default OcpOptimizationsStaging;
