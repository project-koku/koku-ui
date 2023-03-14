import 'routes/views/details/components/dataTable/dataTable.scss';

import { TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Loading } from 'routes/state/loading';
import { getBreakdownPath } from 'routes/views/utils/paths';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { uiSelectors } from 'store/ui';
import { formatPath } from 'utils/paths';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './recommendations.styles';
import { RecommendationsToolbar } from './recommendationsToolbar';

interface RecommendationsContentOwnProps extends RouterComponentProps {
  onClose();
}

interface RecommendationsContentStateProps {
  payload: any;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface RecommendationsContentDispatchProps {
  // TBD...
}

interface RecommendationsContentState {
  query?: Query;
}

type RecommendationsContentProps = RecommendationsContentOwnProps &
  RecommendationsContentStateProps &
  RecommendationsContentDispatchProps &
  WrappedComponentProps;

const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  order_by: {
    name: 'desc',
  },
};

class RecommendationsContentBase extends React.Component<RecommendationsContentProps> {
  protected defaultState: RecommendationsContentState = {
    query: baseQuery,
  };
  public state: RecommendationsContentState = { ...this.defaultState };

  private getDescription = () => {
    const { intl, payload } = this.props;

    return (
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'last_reported' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{payload.lastReported}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'cluster' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{payload.cluster}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'project' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{payload.project}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'workload_type' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{payload.workloadType}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'workload' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{payload.workload}</TextListItem>
        </TextList>
      </TextContent>
    );
  };

  private getChangeValue = value => {
    if (value === 0) {
      return <EmptyValueState />;
    }

    // Show icon opposite of month over month
    let iconOverride = 'iconOverride';
    if (value !== null && value < 0) {
      iconOverride += ' decrease';
    } else if (value !== null && value > 0) {
      iconOverride += ' increase';
    }
    return (
      <div className="monthOverMonthOverride">
        <div className={iconOverride}>
          {value < 0 ? (
            <>
              {value}
              <span className="fa fa-sort-down" style={styles.infoArrow} />
            </>
          ) : (
            <>
              {value}
              <span className="fa fa-sort-up" style={{ ...styles.infoArrow, ...styles.infoArrowDesc }} />
            </>
          )}
        </div>
      </div>
    );
  };

  private getLimitsTable = () => {
    const { intl } = this.props;

    return (
      <TableComposable
        aria-label={intl.formatMessage(messages.recommendationsTableAriaLabel)}
        borders={false}
        hasSelectableRowCaption
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            <Th>{intl.formatMessage(messages.limits)}</Th>
            <Th>{intl.formatMessage(messages.current)}</Th>
            <Th>{intl.formatMessage(messages.recommended)}</Th>
            <Th>{intl.formatMessage(messages.change)}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.cpuUnits)}</Td>
            <Td>500</Td>
            <Td hasRightBorder>500</Td>
            <Td>{this.getChangeValue(0)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.memoryUnits)}</Td>
            <Td>1000</Td>
            <Td hasRightBorder>1100</Td>
            <Td>{this.getChangeValue(100)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  private getRequestsTable = () => {
    const { intl } = this.props;

    return (
      <TableComposable
        aria-label={intl.formatMessage(messages.recommendationsTableAriaLabel)}
        borders={false}
        hasSelectableRowCaption
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            <Th>{intl.formatMessage(messages.requests)}</Th>
            <Th>{intl.formatMessage(messages.current)}</Th>
            <Th>{intl.formatMessage(messages.recommended)}</Th>
            <Th>{intl.formatMessage(messages.change)}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.cpuUnits)}</Td>
            <Td>300</Td>
            <Td hasRightBorder>400</Td>
            <Td>{this.getChangeValue(100)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.memoryUnits)}</Td>
            <Td>100</Td>
            <Td hasRightBorder>110</Td>
            <Td>{this.getChangeValue(10)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  private getUsageTable = () => {
    const { intl } = this.props;

    return (
      <TableComposable
        aria-label={intl.formatMessage(messages.recommendationsTableAriaLabel)}
        borders={false}
        hasSelectableRowCaption
        variant={TableVariant.compact}
      >
        <Thead>
          <Tr>
            <Th>{intl.formatMessage(messages.usage)}</Th>
            <Th>{intl.formatMessage(messages.current)}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.cpuUtilizationUnits)}</Td>
            <Td style={styles.alignLeft}>300</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.memoryUtilizationUnits)}</Td>
            <Td>100</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  private getViewAllLink = () => {
    const { intl, payload, router } = this.props;

    return (
      <Link
        to={getBreakdownPath({
          basePath: formatPath(routes.ocpDetailsBreakdown.path),
          groupBy: 'project',
          id: payload.project,
          router,
          title: payload.project,
        })}
      >
        {intl.formatMessage(messages.recommendationsViewAll)}
      </Link>
    );
  };

  public render() {
    const { reportFetchStatus } = this.props;

    return (
      <div style={styles.content}>
        <div>{this.getDescription()}</div>
        <div style={styles.toolbarContainer}>
          <RecommendationsToolbar />
        </div>
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <>
            <div>{this.getUsageTable()}</div>
            <div style={styles.tableContainer}>{this.getRequestsTable()}</div>
            <div style={styles.tableContainer}>{this.getLimitsTable()}</div>
          </>
        )}
        <div style={styles.viewAllContainer}>{this.getViewAllLink()}</div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<RecommendationsContentOwnProps, RecommendationsContentStateProps>(
  state => {
    const query = {
      filter: {
        ...baseQuery.filter,
      },
      filter_by: baseQuery.filter_by,
      order_by: baseQuery.order_by,
    };

    // Todo: Temp report until APIs are available
    const reportType = ReportType.cost;
    const reportPathsType = ReportPathsType.ocp;

    const reportQueryString = getQuery(query);
    // const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    // Todo: For testing
    const report = {
      meta: {
        count: 11,
        filter: {
          limit: 10,
          offset: 0,
        },
        order_by: {
          cost_total: 'desc',
        },
      },
      data: [
        {
          name: 'OpenShift grouped by Project',
          created: '2022-01-17 13:25:07',
          expires: '2022-01-24',
          status: 'pending',
        },
        {
          name: 'Amazon Web Services grouped by Account',
          created: '2022-01-17 13:24:23',
          expires: '2022-01-24',
          status: 'running',
        },
        {
          name: 'OpenShift grouped by Cluster',
          created: '2022-01-16 13:23:08',
          expires: '2022-01-23',
          status: 'completed',
        },
        {
          name: 'Microsoft Azure grouped by Account',
          created: '2022-01-16 13:18:22',
          expires: '2022-01-23',
          status: 'failed',
        },
        {
          name: 'Google Cloud Platform grouped by Service',
          created: '2022-01-14 09:05:23',
          expires: '2022-01-23',
          status: 'completed',
        },
        {
          name: 'Explorer - OpenShift grouped by Cluster',
          created: '2022-01-14 08:38:42',
          expires: '2022-01-23',
          status: 'completed',
        },
      ],
    } as any;

    return {
      payload: uiSelectors.selectRecommendationsDrawerPayload(state),
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: RecommendationsContentDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const RecommendationsContent = injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(RecommendationsContentBase))
);

export { RecommendationsContent };
