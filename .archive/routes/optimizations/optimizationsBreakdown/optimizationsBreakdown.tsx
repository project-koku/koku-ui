import './optimizationsBreakdown.scss';

import { Alert, List, ListItem, PageSection } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RosQuery } from 'api/queries/rosQuery';
import type { RecommendationItem, RecommendationReportData } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { Loading } from 'routes/components/page/loading';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { breadcrumbLabelKey } from 'utils/props';
import { getNotifications, hasRecommendation } from 'utils/recomendations';
import type { RouterComponentProps } from 'utils/router';

import { styles } from './optimizationsBreakdown.styles';
import { OptimizationsBreakdownConfiguration } from './optimizationsBreakdownConfiguration';
import { OptimizationsBreakdownHeader } from './optimizationsBreakdownHeader';

interface OptimizationsBreakdownOwnProps extends RouterComponentProps {
  id?: string;
}

interface OptimizationsBreakdownStateProps {
  breadcrumbLabel?: string;
  report?: RecommendationReportData;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

export interface OptimizationsBreakdownMapProps {
  query?: RosQuery;
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps & OptimizationsBreakdownStateProps;

// eslint-disable-next-line no-shadow
export const enum Interval {
  short_term = 'short_term', // last 24 hrs
  medium_term = 'medium_term', // last 7 days
  long_term = 'long_term', // last 15 days
}

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendation as any;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  const { breadcrumbLabel, report, reportFetchStatus } = useMapToProps();
  const intl = useIntl();
  const location = useLocation();

  const getDefaultTerm = () => {
    let result = Interval.short_term;
    if (!report?.recommendations?.duration_based) {
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
      <div style={styles.alertContainer}>
        <Alert isInline variant="warning" title={intl.formatMessage(messages.notificationsAlertTitle)}>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>{notification.message}</ListItem>
            ))}
          </List>
        </Alert>
      </div>
    );
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

  const handleOnSelected = (value: Interval) => {
    setCurrentInterval(value);
  };

  const isLoading = reportFetchStatus === FetchStatus.inProgress;

  return (
    <div style={styles.container}>
      <OptimizationsBreakdownHeader
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbPath={
          location.state && location.state.optimizations ? location.state.optimizations.breadcrumbPath : undefined
        }
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
            {getAlert()}
            <OptimizationsBreakdownConfiguration term={getRecommendationTerm()} />
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
    breadcrumbLabel: queryFromRoute[breadcrumbLabelKey],
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsBreakdown;
