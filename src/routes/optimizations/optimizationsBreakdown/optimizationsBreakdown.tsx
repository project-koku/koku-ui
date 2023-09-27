import './optimizationsBreakdown.scss';

import {
  Alert,
  Card,
  CardBody,
  CardTitle,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Grid,
  GridItem,
  List,
  ListItem,
  PageSection,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
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
import { routes } from 'routes';
import { Loading } from 'routes/components/page/loading';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { rosActions, rosSelectors } from 'store/ros';
import { formatOptimization } from 'utils/format';
import { formatPath } from 'utils/paths';
import { getNotifications, hasRecommendation, hasRecommendationValues } from 'utils/recomendations';
import type { RouterComponentProps } from 'utils/router';
import YAML from 'yaml';

import { styles } from './optimizationsBreakdown.styles';
import { OptimizationsBreakdownHeader } from './optimizationsBreakdownHeader';

interface OptimizationsBreakdownOwnProps extends RouterComponentProps {
  id?: string;
}

interface OptimizationsBreakdownStateProps {
  queryFromRoute?: Query;
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
  const [copied, setCopied] = React.useState(false);
  const { queryFromRoute, report, reportFetchStatus } = useMapToProps();
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

  const getChangeValue = (value, units) => {
    const blockComment = `# `;
    return (
      <>
        {value !== null && value < 0 ? (
          <>
            {blockComment}
            <span style={styles.decrease}>
              {intl.formatMessage(messages.optimizationsValue, {
                value: formatOptimization(value),
                units,
              })}
            </span>
          </>
        ) : value > 0 ? (
          <>
            {blockComment}
            <span style={styles.increase}>
              {intl.formatMessage(messages.optimizationsValue, {
                value: formatOptimization(value),
                units,
              })}
            </span>
          </>
        ) : value === 0 ? (
          <>
            {blockComment}
            {intl.formatMessage(messages.optimizationsValue, {
              value: formatOptimization(value),
              units,
            })}
          </>
        ) : (
          <ExclamationTriangleIcon color="orange" />
        )}
      </>
    );
  };

  const getConfig = (key: 'config' | 'current') => {
    const term = getRecommendationTerm();

    const hasConfigLimitsCpu = hasRecommendationValues(term, key, 'limits', 'cpu');
    const hasConfigLimitsMemory = hasRecommendationValues(term, key, 'limits', 'memory');
    const hasConfigRequestsCpu = hasRecommendationValues(term, key, 'requests', 'cpu');
    const hasConfigRequestsMemory = hasRecommendationValues(term, key, 'requests', 'memory');

    const cpuConfigLimitsAmount = hasConfigLimitsCpu ? term[key].limits.cpu.amount : undefined;
    const cpuConfigLimitsUnits = hasConfigLimitsCpu ? term[key].limits.cpu.format : undefined;
    const cpuConfigRequestsAmount = hasConfigRequestsCpu ? term[key].requests.cpu.amount : undefined;
    const cpuConfigRequestsUnits = hasConfigRequestsCpu ? term[key].requests.cpu.format : undefined;

    const memConfigLimitsAmount = hasConfigLimitsMemory ? term[key].limits.memory.amount : undefined;
    const memConfigLimitsUnits = hasConfigLimitsMemory ? term[key].limits.memory.format : undefined;
    const memConfigRequestsAmount = hasConfigRequestsMemory ? term[key].requests.memory.amount : undefined;
    const memConfigRequestsUnits = hasConfigRequestsMemory ? term[key].requests.memory.format : undefined;

    return {
      resources: {
        requests: {
          memory: intl.formatMessage(messages.optimizationsValue, {
            value: getFormattedValue(memConfigRequestsAmount),
            units: memConfigRequestsUnits,
          }),
          cpu: intl.formatMessage(messages.optimizationsValue, {
            value: getFormattedValue(cpuConfigRequestsAmount),
            units: cpuConfigRequestsUnits,
          }),
        },
        limits: {
          memory: intl.formatMessage(messages.optimizationsValue, {
            value: getFormattedValue(memConfigLimitsAmount),
            units: memConfigLimitsUnits,
          }),
          cpu: intl.formatMessage(messages.optimizationsValue, {
            value: getFormattedValue(cpuConfigLimitsAmount),
            units: cpuConfigLimitsUnits,
          }),
        },
      },
    };
  };

  const getCurrentConfig = () => {
    const code = getConfig('current');

    return YAML.stringify(code, null, 2);
  };

  const getCurrentConfigCodeBlock = () => {
    const code = getCurrentConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getEmptyActions()}>
        <CodeBlockCode>{code}</CodeBlockCode>
      </CodeBlock>
    );
  };

  // Returns empty element to force a header
  const getEmptyActions = () => {
    return <div style={styles.currentActions} />;
  };

  const getFormattedValue = value => {
    return value !== undefined ? formatOptimization(value) : undefined;
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

  const getOptimizationCards = () => {
    if (!report) {
      return null;
    }
    return (
      <Grid hasGutter>
        <GridItem xl={6}>
          <Card>
            <CardTitle>
              <Title headingLevel="h2" size={TitleSizes.lg}>
                {intl.formatMessage(messages.currentConfiguration)}
              </Title>
            </CardTitle>
            <CardBody>
              <div style={styles.codeBlock}>
                <div className="leftCodeBlockOverride" style={styles.leftCodeBlock}>
                  {getCurrentConfigCodeBlock()}
                </div>
                <div className="rightCodeBlockOverride" style={styles.rightCodeBlock}>
                  {getWarningsCodeBlock()}
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xl={6}>
          <Card>
            <CardTitle>
              <Title headingLevel="h2" size={TitleSizes.lg}>
                {intl.formatMessage(messages.recommendedConfiguration)}
              </Title>
            </CardTitle>
            <CardBody>
              <div style={styles.codeBlock}>
                <div className="leftCodeBlockOverride" style={styles.leftCodeBlock}>
                  {getRecommendedConfigCodeBlock()}
                </div>
                <div className="rightCodeBlockOverride" style={styles.rightCodeBlock}>
                  {getVariationConfigCodeBlock()}
                </div>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    );
  };

  const getRecommendedActions = () => {
    const code = getRecommendedConfig();

    return (
      <CodeBlockAction>
        <ClipboardCopyButton
          id="copy-button"
          textId="code-content"
          aria-label={intl.formatMessage(messages.copyToClipboard)}
          onClick={e => handleClipboardCopyOnClick(e, code)}
          exitDelay={copied ? 1500 : 600}
          maxWidth="110px"
          variant="plain"
          onTooltipHidden={() => setCopied(false)}
        >
          {intl.formatMessage(copied ? messages.copyToClipboardSuccessfull : messages.copyToClipboard)}
        </ClipboardCopyButton>
      </CodeBlockAction>
    );
  };

  const getRecommendedConfig = () => {
    const code = getConfig('config');
    if (code === null) {
      return null;
    }
    return YAML.stringify(code, null, 2);
  };

  const getRecommendedConfigCodeBlock = () => {
    const code = getRecommendedConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getEmptyActions()}>
        <CodeBlockCode>{code}</CodeBlockCode>
      </CodeBlock>
    );
  };

  const getVariationConfigCodeBlock = () => {
    const code = getVariationConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getRecommendedActions()}>
        <CodeBlockCode>{code}</CodeBlockCode>
      </CodeBlock>
    );
  };

  const getVariationConfig = () => {
    const term = getRecommendationTerm();

    const hasVariationLimitsCpu = hasRecommendationValues(term, 'variation', 'limits', 'cpu');
    const hasVariationLimitsMemory = hasRecommendationValues(term, 'variation', 'limits', 'memory');
    const hasVariationRequestsCpu = hasRecommendationValues(term, 'variation', 'requests', 'cpu');
    const hasVariationRequestsMemory = hasRecommendationValues(term, 'variation', 'requests', 'memory');

    const cpuVariationLimitsAmount = hasVariationLimitsCpu ? term.variation.limits.cpu.amount : undefined;
    const cpuVariationLimitsUnits = hasVariationLimitsCpu ? term.variation.limits.cpu.format : undefined;
    const memVariationLimitsAmount = hasVariationLimitsMemory ? term.variation.limits.memory.amount : undefined;
    const memVariationLimitsUnits = hasVariationLimitsMemory ? term.variation.limits.memory.format : undefined;

    const cpuVariationRequestsAmount = hasVariationRequestsCpu ? term.variation.requests.cpu.amount : undefined;
    const cpuVariationRequestsUnits = hasVariationRequestsCpu ? term.variation.requests.cpu.format : undefined;
    const memVariationRequestsAmount = hasVariationRequestsMemory ? term.variation.requests.memory.amount : undefined;
    const memVariationRequestsUnits = hasVariationRequestsMemory ? term.variation.requests.memory.format : undefined;

    const cpuVariationLimitsChange = getChangeValue(cpuVariationLimitsAmount, cpuVariationLimitsUnits);
    const memoryVariationLimitsChange = getChangeValue(memVariationLimitsAmount, memVariationLimitsUnits);
    const cpuVariationRequestsChange = getChangeValue(cpuVariationRequestsAmount, cpuVariationRequestsUnits);
    const memoryVariationRequestsChange = getChangeValue(memVariationRequestsAmount, memVariationRequestsUnits);

    return (
      <>
        <br />
        <br />
        {memoryVariationRequestsChange}
        <br />
        {cpuVariationRequestsChange}
        <br />
        <br />
        {memoryVariationLimitsChange}
        <br />
        {cpuVariationLimitsChange}
      </>
    );
  };

  const getWarningsConfig = () => {
    const config = getConfig('current');

    const getWarning = (value, defaultValue = null) => {
      return !value ? <ExclamationTriangleIcon color="orange" /> : defaultValue;
    };

    return (
      <>
        <br />
        <br />
        {getWarning(config.resources.requests.memory)}
        <br />
        {getWarning(config.resources.requests.cpu)}
        <br />
        <br />
        {getWarning(config.resources.limits.memory)}
        <br />
        {getWarning(config.resources.limits.cpu, <br />)}
      </>
    );
  };

  const getWarningsCodeBlock = () => {
    const code = getWarningsConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getEmptyActions()}>
        <CodeBlockCode>{code}</CodeBlockCode>
      </CodeBlock>
    );
  };

  const handleClipboardCopyOnClick = (event, text) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
  };

  const handleOnSelected = (value: Interval) => {
    setCurrentInterval(value);
  };

  const isLoading = reportFetchStatus === FetchStatus.inProgress;
  const optimizationsURL = formatPath(routes.optimizationsDetails.path);

  return (
    <div style={styles.container}>
      <OptimizationsBreakdownHeader
        currentInterval={currentInterval}
        isDisabled={isLoading}
        onSelected={handleOnSelected}
        optimizationsURL={optimizationsURL}
        queryFromRoute={queryFromRoute}
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
            {getOptimizationCards()}
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
    queryFromRoute,
    report,
    reportError,
    reportFetchStatus,
    reportQueryString,
  };
};

export default OptimizationsBreakdown;
