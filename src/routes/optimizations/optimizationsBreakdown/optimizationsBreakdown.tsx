import './optimizationsBreakdown.scss';

import { Alert, List, ListItem, PageSection } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TableComposable, TableVariant, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RecommendationItem, RecommendationReportData } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { Loading } from 'routes/components/page/loading';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { formatOptimization } from 'utils/format';
import { getNotifications, hasRecommendation, hasRecommendationValues } from 'utils/recomendations';
import type { RouterComponentProps } from 'utils/router';

import { styles } from './optimizationsBreakdown.styles';
import { OptimizationsBreakdownHeader } from './optimizationsBreakdownHeader';

interface OptimizationsBreakdownOwnProps extends RouterComponentProps {
  id?: string;
}

interface OptimizationsBreakdownStateProps {
  report?: RecommendationReportData;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface OptimizationsBreakdownDispatchProps {
  fetchRosReport: typeof rosActions.fetchRosReport;
}

export interface OptimizationsBreakdownMapProps {
  query?: RosQuery;
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps &
  OptimizationsBreakdownStateProps &
  OptimizationsBreakdownDispatchProps &
  WrappedComponentProps;

// eslint-disable-next-line no-shadow
export const enum Interval {
  short_term = 'short_term', // last 24 hrs
  medium_term = 'medium_term', // last 7 days
  long_term = 'long_term', // last 15 days
}

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendation as any;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  const { report, reportFetchStatus } = useMapToProps();
  const intl = useIntl();

  const getDefaultTerm = () => {
    let result = Interval.short_term;
    if (!(report && report.recommendations && report.recommendations.duration_based)) {
      return result;
    }

    const recommendation = report.recommendations.duration_based;
    if (hasRecommendation(recommendation.short_term)) {
      result = Interval.short_term;
    } else if (hasRecommendation(recommendation.medium_term)) {
      result = Interval.medium_term;
    } else if (hasRecommendation(recommendation.long_term)) {
      result = Interval.long_term;
    }
    return result as Interval;
  };

  const [currentInterval, setCurrentInterval] = useState(getDefaultTerm());

  const getAlert = () => {
    let notifications;
    if (report?.recommendations?.duration_based?.[currentInterval]) {
      notifications = getNotifications(report.recommendations.duration_based[currentInterval]);
    }

    if (!notifications) {
      return null;
    }

    return (
      <Alert isInline variant="warning" title={intl.formatMessage(messages.notificationsAlertTitle)}>
        <List>
          {notifications.map((notification, index) => (
            <ListItem key={index}>{notification.message}</ListItem>
          ))}
        </List>
      </Alert>
    );
  };

  const getChangeValue = (value, units = '') => {
    // Show icon opposite of month over month
    let iconOverride = 'iconOverride';
    if (value !== null && value < 0) {
      iconOverride += ' decrease';
    } else if (value !== null && value > 0) {
      iconOverride += ' increase';
    }
    return (
      <div className="optimizationsOverride">
        <div className={iconOverride}>
          {value < 0 ? (
            <>
              <span style={styles.value}>
                {intl.formatMessage(messages.optimizationsValue, {
                  value: formatOptimization(value),
                  units,
                })}
              </span>
              <span className="fa fa-sort-down" />
            </>
          ) : value > 0 ? (
            <>
              <span style={styles.value}>
                {intl.formatMessage(messages.optimizationsValue, {
                  value: formatOptimization(value),
                  units,
                })}
              </span>
              <span className="fa fa-sort-up" />
            </>
          ) : value === 0 ? (
            <>
              <span style={styles.value}>
                {intl.formatMessage(messages.optimizationsValue, {
                  value: formatOptimization(value),
                  units,
                })}
              </span>
              <span className="fa fa-equals" />
            </>
          ) : (
            <ExclamationTriangleIcon color="orange" />
          )}
        </div>
      </div>
    );
  };

  const getLimitsTable = () => {
    if (!report) {
      return null;
    }

    const term = getRecommendationTerm();
    if (!hasRecommendation(term)) {
      return null;
    }

    const hasConfigLimitsCpu = hasRecommendationValues(term, 'config', 'limits', 'cpu');
    const hasConfigLimitsMemory = hasRecommendationValues(term, 'config', 'limits', 'memory');
    const hasCurrentLimitsCpu = hasRecommendationValues(term, 'current', 'limits', 'cpu');
    const hasCurrentLimitsMemory = hasRecommendationValues(term, 'current', 'limits', 'memory');
    const hasVariationLimitsCpu = hasRecommendationValues(term, 'variation', 'limits', 'cpu');
    const hasVariationLimitsMemory = hasRecommendationValues(term, 'variation', 'limits', 'memory');

    const cpuConfigAmount = hasConfigLimitsCpu ? term.config.limits.cpu.amount : undefined;
    const cpuConfigUnits = hasConfigLimitsCpu ? term.config.limits.cpu.format : undefined;
    const cpuCurrentAmount = hasCurrentLimitsCpu ? term.current.limits.cpu.amount : undefined;
    const cpuCurrentUnits = hasCurrentLimitsCpu ? term.current.limits.cpu.format : undefined;
    const cpuVariation = hasVariationLimitsCpu ? term.variation.limits.cpu.amount : undefined;
    const cpuVariationUnits = hasVariationLimitsCpu ? term.variation.limits.cpu.format : undefined;

    const memConfigAmount = hasConfigLimitsMemory ? term.config.limits.memory.amount : undefined;
    const memConfigUnits = hasConfigLimitsMemory ? term.config.limits.memory.format : undefined;
    const memCurrentAmount = hasCurrentLimitsMemory ? term.current.limits.memory.amount : undefined;
    const memCurrentUnits = hasCurrentLimitsMemory ? term.current.limits.memory.format : undefined;
    const memVariation = hasVariationLimitsMemory ? term.variation.limits.memory.amount : undefined;
    const memVariationUnits = hasVariationLimitsMemory ? term.variation.limits.memory.format : undefined;

    return (
      <TableComposable
        aria-label={intl.formatMessage(messages.optimizationsTableAriaLabel)}
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
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.cpuTitle)}</Td>
            <Td>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(cpuCurrentAmount),
                units: cpuCurrentUnits,
              })}
            </Td>
            <Td hasRightBorder>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(cpuConfigAmount),
                units: cpuConfigUnits,
              })}
            </Td>
            <Td>{getChangeValue(cpuVariation, cpuVariationUnits)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.memoryTitle)}</Td>
            <Td>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(memCurrentAmount),
                units: memCurrentUnits,
              })}
            </Td>
            <Td hasRightBorder>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(memConfigAmount),
                units: memConfigUnits,
              })}
            </Td>
            <Td>{getChangeValue(memVariation, memVariationUnits)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  const getFormattedValue = value => {
    return value !== undefined ? formatOptimization(value) : <ExclamationTriangleIcon color="orange" />;
  };

  const getRecommendationTerm = (): RecommendationItem => {
    if (!report) {
      return undefined;
    }

    let result;
    switch (currentInterval) {
      case Interval.short_term:
        result = report.recommendations.duration_based.short_term;
        break;
      case Interval.medium_term:
        result = report.recommendations.duration_based.medium_term;
        break;
      case Interval.long_term:
        result = report.recommendations.duration_based.long_term;
        break;
    }
    return result;
  };

  const getRequestsTable = () => {
    if (!report) {
      return null;
    }
    const term = getRecommendationTerm();
    if (!hasRecommendation(term)) {
      return null;
    }

    const hasConfigRequestsCpu = hasRecommendationValues(term, 'config', 'requests', 'cpu');
    const hasConfigRequestsMemory = hasRecommendationValues(term, 'config', 'requests', 'memory');
    const hasCurrentLimitsCpu = hasRecommendationValues(term, 'current', 'requests', 'cpu');
    const hasCurrentLimitsMemory = hasRecommendationValues(term, 'current', 'requests', 'memory');
    const hasVariationRequestsCpu = hasRecommendationValues(term, 'variation', 'requests', 'cpu');
    const hasVariationRequestsMemory = hasRecommendationValues(term, 'variation', 'requests', 'memory');

    const cpuConfigAmount = hasConfigRequestsCpu ? term.config.requests.cpu.amount : undefined;
    const cpuConfigUnits = hasConfigRequestsCpu ? term.config.requests.cpu.format : undefined;
    const cpuCurrentAmount = hasCurrentLimitsCpu ? term.current.requests.cpu.amount : undefined;
    const cpuCurrentUnits = hasCurrentLimitsCpu ? term.current.requests.cpu.format : undefined;
    const cpuVariation = hasVariationRequestsCpu ? term.variation.requests.cpu.amount : undefined;
    const cpuVariationUnits = hasVariationRequestsCpu ? term.variation.requests.cpu.format : undefined;

    const memConfigAmount = hasConfigRequestsMemory ? term.config.requests.memory.amount : undefined;
    const memConfigUnits = hasConfigRequestsMemory ? term.config.requests.memory.format : undefined;
    const memCurrentAmount = hasCurrentLimitsMemory ? term.current.requests.memory.amount : undefined;
    const memCurrentUnits = hasCurrentLimitsMemory ? term.current.requests.memory.format : undefined;
    const memVariation = hasVariationRequestsMemory ? term.variation.requests.memory.amount : undefined;
    const memVariationUnits = hasVariationRequestsMemory ? term.variation.requests.memory.format : undefined;

    return (
      <TableComposable
        aria-label={intl.formatMessage(messages.optimizationsTableAriaLabel)}
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
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.cpuTitle)}</Td>
            <Td>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(cpuCurrentAmount),
                units: cpuCurrentUnits,
              })}
            </Td>
            <Td hasRightBorder>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(cpuConfigAmount),
                units: cpuConfigUnits,
              })}
            </Td>
            <Td>{getChangeValue(cpuVariation, cpuVariationUnits)}</Td>
          </Tr>
          <Tr>
            <Td style={styles.firstColumn}>{intl.formatMessage(messages.memoryTitle)}</Td>
            <Td>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(memCurrentAmount),
                units: memCurrentUnits,
              })}
            </Td>
            <Td hasRightBorder>
              {intl.formatMessage(messages.optimizationsValue, {
                value: getFormattedValue(memConfigAmount),
                units: memConfigUnits,
              })}
            </Td>
            <Td>{getChangeValue(memVariation, memVariationUnits)}</Td>
          </Tr>
        </Tbody>
      </TableComposable>
    );
  };

  const handleOnSelected = (value: Interval) => {
    setCurrentInterval(value);
  };

  const isLoading = reportFetchStatus === FetchStatus.inProgress;

  return (
    <div style={styles.container}>
      <OptimizationsBreakdownHeader
        currentInterval={currentInterval}
        isDisabled={isLoading}
        onSelected={handleOnSelected}
        report={report}
      />
      <PageSection isFilled>
        {isLoading ? (
          <Loading
            body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
            heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
          />
        ) : (
          <>
            <div style={styles.alertContainer}>{getAlert()}</div>
            <div style={styles.tableContainer}>{getRequestsTable()}</div>
            <div style={styles.tableContainer}>{getLimitsTable()}</div>
          </>
        )}
      </PageSection>
    </div>
  );
};

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): OptimizationsBreakdownStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();

  const reportQueryString = queryFromRoute ? queryFromRoute.id : '';
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
    if (!reportError && reportFetchStatus !== FetchStatus.inProgress) {
      dispatch(rosActions.fetchRosReport(reportPathsType, reportType, reportQueryString));
    }
  }, [reportQueryString]);

  return {
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsBreakdown;
