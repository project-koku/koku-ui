import { Button, Tooltip } from '@patternfly/react-core';
import { getQuery } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { useIsProjectLinkToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getBreakdownPath } from 'routes/utils/paths';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownProjectLinkOwnProps {
  breadcrumbLabel?: string;
  isOptimizationsDetails?: boolean;
  linkPath?: string;
  project?: string;
}

interface OptimizationsBreakdownProjectLinkStateProps {
  isProjectLinkToggleEnabled?: boolean;
  report?: OcpReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type OptimizationsBreakdownProjectLinkProps = OptimizationsBreakdownProjectLinkOwnProps &
  OptimizationsBreakdownProjectLinkStateProps;

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

const OptimizationsBreakdownProjectLink: React.FC<OptimizationsBreakdownProjectLinkProps> = ({
  breadcrumbLabel,
  isOptimizationsDetails,
  linkPath,
  project,
}) => {
  const { isProjectLinkToggleEnabled, report } = useMapToProps({ project, linkPath });
  const location = useLocation();
  const intl = useIntl();

  // Is stand alone?
  if (!linkPath || !isOptimizationsDetails || !isProjectLinkToggleEnabled) {
    return project;
  }
  if (!report) {
    return null;
  }

  const getComputedItems = () => {
    return getUnsortedComputedReportItems({
      report,
      idKey: 'project',
    } as any);
  };
  const computedItems = getComputedItems();
  const isDisabled = computedItems.length === 0;
  const breakdownPath = getBreakdownPath({
    basePath: linkPath,
    breadcrumbLabel,
    groupBy: 'project',
    id: project,
    isOptimizationsTab: true,
    title: project,
  });

  const buttonComponent = (
    <Button
      isAriaDisabled={isDisabled}
      variant="link"
      component={(props: any) => <Link {...props} to={breakdownPath} state={{ ...location.state }} />}
      style={styles.projectLink}
    >
      {project}
    </Button>
  );
  return (
    <Tooltip
      content={intl.formatMessage(isDisabled ? messages.optimizationsViewAllDisabled : messages.optimizationsViewAll)}
    >
      {buttonComponent}
    </Tooltip>
  );
};

const useMapToProps = ({ project, linkPath }): OptimizationsBreakdownProjectLinkStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const reportQueryString = getQuery({
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    group_by: {
      project,
    },
  });
  const report: any = useSelector((state: RootState) =>
    reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString)
  );
  const reportFetchStatus = useSelector((state: RootState) =>
    reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, reportQueryString)
  );
  const reportError = useSelector((state: RootState) =>
    reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString)
  );

  useEffect(() => {
    if (linkPath && !reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(reportActions.fetchReport(reportPathsType, reportType, reportQueryString));
    }
  }, [linkPath, reportQueryString]);

  return {
    isProjectLinkToggleEnabled: useIsProjectLinkToggleEnabled(),
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export { OptimizationsBreakdownProjectLink };
