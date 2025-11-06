import './optimizationsBreakdown.scss';

import { Alert, List, ListItem, PageSection, Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { parseQuery } from 'api/queries/query';
import type { RecommendationReportData } from 'api/ros/recommendations';
import { RosPathsType, RosType } from 'api/ros/ros';
import type { AxiosError } from 'axios';
import { useIsBoxPlotToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import type { RefObject } from 'react';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { LoadingState } from 'routes/components/state/loadingState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { Interval, OptimizationType } from 'utils/commonTypes';
import { getNotifications, hasNotifications } from 'utils/notifications';
import { breadcrumbLabelKey } from 'utils/props';
import { hasRecommendation } from 'utils/recomendations';
import { getRecommendationTerm } from 'utils/recomendations';

import { styles } from './optimizationsBreakdown.styles';
import { OptimizationsBreakdownConfiguration } from './optimizationsBreakdownConfiguration';
import { OptimizationsBreakdownHeader } from './optimizationsBreakdownHeader';
import { OptimizationsBreakdownUtilization } from './optimizationsBreakdownUtilization';

export const getIdKeyForTab = (tab: OptimizationType) => {
  switch (tab) {
    case OptimizationType.cost:
      return 'cost';
    case OptimizationType.performance:
      return 'performance';
  }
};

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: OptimizationType;
}

interface OptimizationsBreakdownOwnProps {
  // TBD...
}

interface OptimizationsBreakdownStateProps {
  breadcrumbLabel?: string;
  breadcrumbPath?: string;
  isBoxPlotToggleEnabled?: boolean;
  isOptimizationsDetails?: boolean;
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
  report?: RecommendationReportData;
  reportError?: AxiosError;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

type OptimizationsBreakdownProps = OptimizationsBreakdownOwnProps & OptimizationsBreakdownStateProps;

const reportType = RosType.ros as any;
const reportPathsType = RosPathsType.recommendation as any;

const OptimizationsBreakdown: React.FC<OptimizationsBreakdownProps> = () => {
  const {
    breadcrumbLabel,
    breadcrumbPath,
    isBoxPlotToggleEnabled,
    isOptimizationsDetails,
    projectPath,
    report,
    reportFetchStatus,
  } = useMapToProps();
  const [activeTabKey, setActiveTabKey] = useState(0);
  const intl = useIntl();

  const getOptimizationType = () => {
    switch (activeTabKey) {
      case 1:
        return OptimizationType.performance;
      case 0:
      default:
        return OptimizationType.cost;
    }
  };

  const getDefaultInterval = () => {
    let result = Interval.short_term;
    const terms = report?.recommendations?.recommendation_terms;
    const optimizationType = getOptimizationType();

    if (!terms) {
      return result;
    }

    if (
      hasRecommendation(terms?.short_term?.recommendation_engines?.[optimizationType]?.config) ||
      hasNotifications(report?.recommendations, Interval.short_term, optimizationType)
    ) {
      result = Interval.short_term;
    } else if (
      hasRecommendation(terms?.medium_term?.recommendation_engines?.[optimizationType]?.config) ||
      hasNotifications(report?.recommendations, Interval.medium_term, optimizationType)
    ) {
      result = Interval.medium_term;
    } else if (
      hasRecommendation(terms?.long_term?.recommendation_engines?.[optimizationType]?.config) ||
      hasNotifications(report?.recommendations, Interval.long_term, optimizationType)
    ) {
      result = Interval.long_term;
    }
    return result as Interval;
  };

  const [currentInterval, setCurrentInterval] = useState(getDefaultInterval());

  const getAlert = () => {
    const notifications = getNotifications(report?.recommendations, currentInterval, getOptimizationType());

    if (notifications.length === 0) {
      return null;
    }
    return (
      <div style={styles.alertContainer}>
        <Alert isInline variant="warning" title={intl.formatMessage(messages.notificationsAlertTitle)}>
          <List>
            {notifications?.map((notification, index) => (
              <ListItem key={index}>{notification.message}</ListItem>
            ))}
          </List>
        </Alert>
      </div>
    );
  };

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: OptimizationType.cost,
      },
      {
        contentRef: React.createRef(),
        tab: OptimizationType.performance,
      },
    ];
    return availableTabs;
  };

  const getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  const getTabItem = (tab: OptimizationType, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === OptimizationType.cost || currentTab === OptimizationType.performance) {
      const term = getRecommendationTerm(report?.recommendations, currentInterval);
      const plotsData = term?.plots?.plots_data;

      return (
        <>
          <OptimizationsBreakdownConfiguration
            currentInterval={currentInterval}
            optimizationType={tab}
            recommendations={report?.recommendations}
          />
          {plotsData && isBoxPlotToggleEnabled && (
            <div style={styles.utilizationContainer}>
              <OptimizationsBreakdownUtilization
                currentInterval={currentInterval}
                optimizationType={tab}
                recommendations={report?.recommendations}
              />
            </div>
          )}
        </>
      );
    } else {
      return emptyTab;
    }
  };

  const getTab = (tab: OptimizationType, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  const getTabs = (availableTabs: AvailableTab[]) => {
    return (
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        {availableTabs.map((val, index) => getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  const getTabTitle = (tab: OptimizationType) => {
    if (tab === OptimizationType.cost) {
      return intl.formatMessage(messages.optimizationsCost);
    } else if (tab === OptimizationType.performance) {
      return intl.formatMessage(messages.optimizationsPerformance);
    }
  };

  const handleOnSelect = (value: Interval) => {
    setCurrentInterval(value);
  };

  const handleTabClick = (event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const isLoading = reportFetchStatus === FetchStatus.inProgress;
  // eslint-disable-next-line
  const [availableTabs] = useState(getAvailableTabs());

  return (
    <>
      <PageSection style={styles.headerContainer}>
        <OptimizationsBreakdownHeader
          breadcrumbLabel={breadcrumbLabel}
          breadcrumbPath={breadcrumbPath}
          currentInterval={currentInterval}
          isDisabled={isLoading}
          isOptimizationsDetails={isOptimizationsDetails}
          onSelect={handleOnSelect}
          optimizationType={getOptimizationType()}
          projectPath={projectPath}
          report={report}
        />
      </PageSection>
      <PageSection>{getTabs(availableTabs)}</PageSection>
      <PageSection>
        {isLoading ? (
          <LoadingState
            body={intl.formatMessage(messages.optimizationsLoadingStateDesc)}
            heading={intl.formatMessage(messages.optimizationsLoadingStateTitle)}
          />
        ) : (
          <div>
            {getAlert()}
            {getTabContent(availableTabs)}
          </div>
        )}
      </PageSection>
    </>
  );
};

const useQueryFromRoute = () => {
  const location = useLocation();
  return parseQuery<Query>(location.search);
};

const useMapToProps = (): OptimizationsBreakdownStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const queryFromRoute = useQueryFromRoute();
  const location = useLocation();

  const reportQueryString = queryFromRoute ? queryFromRoute.id : ''; // Flatten ID
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

  const isOptimizationsDetails = queryFromRoute?.isOptimizationsDetails === 'true';

  return {
    breadcrumbLabel: queryFromRoute[breadcrumbLabelKey],
    breadcrumbPath:
      location?.state?.[isOptimizationsDetails ? 'optimizations' : 'optimizationsBreakdown']?.breadcrumbPath,
    isBoxPlotToggleEnabled: useIsBoxPlotToggleEnabled(),
    isOptimizationsDetails,
    projectPath: location?.state?.optimizations?.projectPath,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsBreakdown;
