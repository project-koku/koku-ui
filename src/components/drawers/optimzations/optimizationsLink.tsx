import './optimizations.scss';

import { Button, Tooltip } from '@patternfly/react-core';
import { getQuery } from 'api/queries/ocpQuery';
import type { RosQuery } from 'api/queries/rosQuery';
import { parseQuery } from 'api/queries/rosQuery';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getGroupById } from 'routes/utils/groupBy';
import { getBreakdownPath } from 'routes/utils/paths';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatPath } from 'utils/paths';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface OptimizationsLinkOwnProps extends RouterComponentProps {
  id?: string;
  project?: string;
}

interface OptimizationsLinkStateProps {
  isStandalone?: boolean;
  report?: OcpReport;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface OptimizationsLinkDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface OptimizationsLinkState {
  // TBD...
}

type OptimizationsLinkProps = OptimizationsLinkOwnProps &
  OptimizationsLinkStateProps &
  OptimizationsLinkDispatchProps &
  WrappedComponentProps;

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class OptimizationsLinkBase extends React.Component<OptimizationsLinkProps, any> {
  protected defaultState: OptimizationsLinkState = {};
  public state: OptimizationsLinkState = { ...this.defaultState };

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: OptimizationsLinkProps) {
    if (prevProps.id !== this.props.id) {
      this.updateReport();
    }
  }

  private updateReport() {
    const { fetchReport, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  }

  private getComputedItems = () => {
    const { report } = this.props;

    return getUnsortedComputedReportItems({
      report,
      idKey: 'project',
    } as any);
  };

  public render() {
    const { intl, isStandalone, project, report, router } = this.props;

    if (!isStandalone || !report) {
      return null;
    }

    const computedItems = this.getComputedItems();
    const isDisabled = computedItems.length === 0;

    const breakdownPath = getBreakdownPath({
      basePath: formatPath(routes.ocpBreakdown.path),
      groupBy: 'project',
      id: project,
      isOptimizationsPath: true,
      isOptimizationsTab: true,
      router,
      title: project,
    });

    const buttonComponent = (
      <Button
        isAriaDisabled={isDisabled}
        variant="link"
        component={(props: any) => <Link {...props} to={breakdownPath} />}
      >
        {intl.formatMessage(messages.optimizationsViewAll)}
      </Button>
    );
    if (isDisabled) {
      return (
        <Tooltip content={intl.formatMessage(messages.optimizationsViewAllDisabled)} removeFindDomNode>
          {buttonComponent}
        </Tooltip>
      );
    }
    return buttonComponent;
  }
}

const mapStateToProps = createMapStateToProps<OptimizationsLinkOwnProps, OptimizationsLinkStateProps>(
  (state, { project, router }) => {
    const queryFromRoute = parseQuery<RosQuery>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);

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
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      isStandalone: groupBy === undefined,
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: OptimizationsLinkDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OptimizationsLink = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(OptimizationsLinkBase)));

export { OptimizationsLink };
