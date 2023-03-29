import './recommendations.scss';

import { TextContent, TextList, TextListItem, TextListItemVariants, TextListVariants } from '@patternfly/react-core';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { RecommendationReportData } from 'api/ros/recommendations';
import type { RecommendationItem } from 'api/ros/recommendations';
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
import { getGroupById } from 'routes/views/utils/groupBy';
import { getBreakdownPath } from 'routes/views/utils/paths';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { uiSelectors } from 'store/ui';
import { getTimeFromNow } from 'utils/dates';
import { formatPath } from 'utils/paths';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './recommendations.styles';
import { RecommendationsToolbar } from './recommendationsToolbar';

interface RecommendationsContentOwnProps extends RouterComponentProps {
  onClose();
}

interface RecommendationsContentStateProps {
  groupBy?: string;
  payload: RecommendationReportData;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface RecommendationsContentDispatchProps {
  // TBD...
}

interface RecommendationsContentState {
  currentTerm: string;
  query?: Query;
}

type RecommendationsContentProps = RecommendationsContentOwnProps &
  RecommendationsContentStateProps &
  RecommendationsContentDispatchProps &
  WrappedComponentProps;

// eslint-disable-next-line no-shadow
export const enum RecommendationTerm {
  short_term = 'short_term', // last 24 hrs
  medium_term = 'medium_term', // last 7 days
  long_term = 'long_term', // last 15 days
}

const baseQuery: Query = {
  filter: {
    limit: 10,
    offset: 0,
  },
  order_by: {
    name: 'desc',
  },
};

class RecommendationsContentBase extends React.Component<RecommendationsContentProps, any> {
  protected defaultState: RecommendationsContentState = {
    currentTerm: RecommendationTerm.short_term,
    query: baseQuery,
  };
  public state: RecommendationsContentState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);

    this.setState({ currentTerm: this.getDefaultTerm() });
  }

  private getDefaultTerm = () => {
    const { payload: item } = this.props;

    let result = RecommendationTerm.short_term;
    if (!(item && item.recommendations)) {
      return result;
    }
    if (item.recommendations.short_term) {
      result = RecommendationTerm.short_term;
    }
    if (item.recommendations.medium_term) {
      result = RecommendationTerm.medium_term;
    }
    if (item.recommendations.long_term) {
      result = RecommendationTerm.long_term;
    }
    return result;
  };

  private getDescription = () => {
    const { intl, payload: item } = this.props;

    const cluster = item.cluster_alias ? item.cluster_alias : item.cluster_uuid ? item.cluster_uuid : '';
    const lastReported = getTimeFromNow(item.last_reported);
    const project = item.project ? item.project : '';
    const workload = item.workload ? item.workload : '';
    const workloadType = item.workload_type ? item.workload_type : '';

    return (
      <TextContent>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'last_reported' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{lastReported}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'cluster' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{cluster}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'project' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{project}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'workload_type' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{workload}</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            {intl.formatMessage(messages.recommendationsValues, { value: 'workload' })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>{workloadType}</TextListItem>
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
      <div className="recommendationsOverride">
        <div className={iconOverride}>
          {value < 0 ? (
            <>
              {value}
              <span className="fa fa-sort-down" />
            </>
          ) : (
            <>
              {value}
              <span className="fa fa-sort-up" />
            </>
          )}
        </div>
      </div>
    );
  };

  private getLimitsTable = () => {
    const { intl } = this.props;

    const recommendations = this.getRecommendations();

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
            <Td style={styles.firstColumn}>
              {intl.formatMessage(messages.cpuUnits, { value: recommendations.config.limits.cpu.format })}
            </Td>
            <Td>N/A</Td>
            <Td hasRightBorder>{recommendations.config.limits.cpu.amount}</Td>
            <Td>{this.getChangeValue(recommendations.variation.limits.cpu.amount)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>
              {intl.formatMessage(messages.memoryUnits, { value: recommendations.config.limits.memory.format })}
            </Td>
            <Td>N/A</Td>
            <Td hasRightBorder>{recommendations.config.limits.memory.amount}</Td>
            <Td>{this.getChangeValue(recommendations.variation.limits.memory.amount)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  private getRecommendations = (): RecommendationItem => {
    const { payload: item } = this.props;
    const { currentTerm } = this.state;

    let result;
    switch (currentTerm) {
      case RecommendationTerm.short_term:
        result = item.recommendations.short_term;
        break;
      case RecommendationTerm.medium_term:
        result = item.recommendations.medium_term;
        break;
      case RecommendationTerm.long_term:
        result = item.recommendations.long_term;
        break;
    }
    return result;
  };

  private getRequestsTable = () => {
    const { intl } = this.props;

    const recommendations = this.getRecommendations();

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
            <Td style={styles.firstColumn}>
              {intl.formatMessage(messages.cpuUnits, { value: recommendations.config.requests.cpu.format })}
            </Td>
            <Td>N/A</Td>
            <Td hasRightBorder>{recommendations.config.requests.cpu.amount}</Td>
            <Td>{this.getChangeValue(recommendations.variation.requests.cpu.amount)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>
              {intl.formatMessage(messages.memoryUnits, { value: recommendations.config.requests.memory.format })}
            </Td>
            <Td>N/A</Td>
            <Td hasRightBorder>{recommendations.config.requests.memory.amount}</Td>
            <Td>{this.getChangeValue(recommendations.variation.requests.memory.amount)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  private getViewAllLink = () => {
    const { groupBy, intl, payload, router } = this.props;

    if (groupBy !== undefined) {
      return null;
    }
    return (
      <Link
        to={getBreakdownPath({
          basePath: formatPath(routes.ocpDetailsBreakdown.path),
          groupBy: 'project',
          id: payload.project,
          isRecommendations: true,
          router,
          title: payload.project,
        })}
      >
        {intl.formatMessage(messages.recommendationsViewAll)}
      </Link>
    );
  };

  private handleOnSelected = (value: string) => {
    this.setState({ currentTerm: value });
  };

  public render() {
    const { payload: item, reportFetchStatus } = this.props;
    const { currentTerm } = this.state;

    return (
      <div style={styles.content}>
        <div>{this.getDescription()}</div>
        <div style={styles.toolbarContainer}>
          <RecommendationsToolbar
            currentItem={currentTerm}
            recommendations={item.recommendations}
            onSelected={this.handleOnSelected}
          />
        </div>
        {reportFetchStatus === FetchStatus.inProgress ? (
          <Loading />
        ) : (
          <>
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
  (state, { router }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);
    const groupBy = getGroupById(queryFromRoute);

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
      groupBy,
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
