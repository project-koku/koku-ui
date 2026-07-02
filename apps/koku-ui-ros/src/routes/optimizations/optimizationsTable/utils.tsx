import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TrendDownIcon } from '@patternfly/react-icons/dist/esm/icons/trend-down-icon';
import { TrendUpIcon } from '@patternfly/react-icons/dist/esm/icons/trend-up-icon';
import type { Query } from 'api/queries/query';
import type { RecommendationEngine, Recommendations } from 'api/ros/recommendations';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { Location } from 'react-router-dom';
import type { Interval, OptimizationType } from 'utils/commonTypes';
import { formatOptimization, formatPercentage, unitsLookupKey } from 'utils/format';

import { styles } from './optimizationsTable.styles';

const formatValue = (value, units, isFormatted = true, isK8Units = false) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '';
  }

  if (units === 'percent') {
    const percentage = value ?? 0;

    return isFormatted
      ? intl.formatMessage(messages.percentPlus, {
          count: percentage > 0 ? 1 : 0,
          value: formatPercentage(percentage),
        })
      : value;
  } else {
    const formattedUnits = intl.formatMessage(isK8Units ? messages.unitsK8 : messages.units, {
      units: unitsLookupKey(units),
    });

    return isFormatted
      ? intl.formatMessage(messages.optimizationsValue, {
          count: 1,
          value: formatOptimization(value),
          units: formattedUnits,
        })
      : value;
  }
};

export const getConfiguration = (values: RecommendationEngine, isFormatted: boolean, isK8Units: boolean) => {
  if (!values) {
    return undefined;
  }

  const cpuConfigAmount = values?.config?.requests?.cpu?.amount;
  const cpuVariationAmount = values?.variation?.requests?.cpu?.amount;
  const memoryConfigAmount = values?.config?.requests?.memory?.amount;
  const memoryVariationAmount = values?.variation?.requests?.memory?.amount;

  const hasCpuRequestConfig = typeof cpuConfigAmount === 'number' && !Number.isNaN(cpuConfigAmount);
  const hasCpuRequestVariation = typeof cpuVariationAmount === 'number' && !Number.isNaN(cpuVariationAmount);
  const hasMemoryRequestConfig = typeof memoryConfigAmount === 'number' && !Number.isNaN(memoryConfigAmount);
  const hasMemoryRequestVariation = typeof memoryVariationAmount === 'number' && !Number.isNaN(memoryVariationAmount);

  const cpuRequestConfigValue = hasCpuRequestConfig ? cpuConfigAmount : undefined;
  const cpuRequestConfigUnits = hasCpuRequestConfig ? values?.config?.requests?.cpu?.format : undefined;
  const cpuRequestVariationValue = hasCpuRequestVariation ? cpuVariationAmount : undefined;
  const cpuRequestVariationUnits = hasCpuRequestVariation ? values?.variation?.requests?.cpu?.format : undefined;

  const memoryRequestConfigValue = hasMemoryRequestConfig ? memoryConfigAmount : undefined;
  const memoryRequestConfigUnits = hasMemoryRequestConfig ? values?.config?.requests?.memory?.format : undefined;
  const memoryRequestVariationValue = hasMemoryRequestVariation ? memoryVariationAmount : undefined;
  const memoryRequestVariationUnits = hasMemoryRequestVariation
    ? values?.variation?.requests?.memory?.format
    : undefined;

  return {
    cpuRequestConfig: formatValue(cpuRequestConfigValue, cpuRequestConfigUnits, isFormatted, isK8Units),
    cpuRequestVariation: formatValue(cpuRequestVariationValue, cpuRequestVariationUnits, isFormatted, isK8Units),
    memoryRequestConfig: formatValue(memoryRequestConfigValue, memoryRequestConfigUnits, isFormatted, isK8Units),
    memoryRequestVariation: formatValue(
      memoryRequestVariationValue,
      memoryRequestVariationUnits,
      isFormatted,
      isK8Units
    ),
  };
};

export const getCurrentConfiguration = (values: Recommendations, isFormatted: boolean, isK8Units: boolean) => {
  if (!values) {
    return undefined;
  }

  const cpuAmount = values?.current?.requests?.cpu?.amount;
  const memoryAmount = values?.current?.requests?.memory?.amount;

  const hasCpuRequestCurrent = typeof cpuAmount === 'number' && !Number.isNaN(cpuAmount);
  const hasMemoryRequestCurrent = typeof memoryAmount === 'number' && !Number.isNaN(memoryAmount);

  const cpuRequestConfigValue = hasCpuRequestCurrent ? cpuAmount : undefined;
  const cpuRequestConfigUnits = hasCpuRequestCurrent ? values?.current?.requests?.cpu?.format : undefined;

  const memoryRequestConfigValue = hasMemoryRequestCurrent ? memoryAmount : undefined;
  const memoryRequestConfigUnits = hasMemoryRequestCurrent ? values?.current?.requests?.memory?.format : undefined;

  return {
    cpuRequestCurrent: formatValue(cpuRequestConfigValue, cpuRequestConfigUnits, isFormatted, isK8Units),
    memoryRequestCurrent: formatValue(memoryRequestConfigValue, memoryRequestConfigUnits, isFormatted, isK8Units),
  };
};

export const getLinkState = ({
  breadcrumbPath,
  linkState,
  location,
  query,
  queryStateName,
}: {
  breadcrumbPath?: string;
  linkState?: any; // Optimizations breakdown link state
  location?: Location;
  query?: Query;
  queryStateName: string;
}) => {
  return {
    ...(location?.state || {}),
    ...(linkState || {}),
    ...(queryStateName && {
      [queryStateName]: {
        ...(linkState?.[queryStateName] || {}),
        ...(breadcrumbPath && { breadcrumbPath }), // Path back to optimizations details page
        ...(query || {}),
      },
    }),
  };
};

export const getRequestProps = (
  recommendations: Recommendations,
  interval: Interval,
  optimizationType: OptimizationType
) => {
  const currentFormatted = getCurrentConfiguration(recommendations, true, false);
  const configFormatted = getConfiguration(
    recommendations?.recommendation_terms?.[interval]?.recommendation_engines?.[optimizationType],
    true,
    false
  );
  const configRaw = getConfiguration(
    recommendations?.recommendation_terms?.[interval]?.recommendation_engines?.[optimizationType],
    false,
    false
  );

  const getTrend = value => {
    if (value > 0) {
      return (
        <Icon status="success" style={styles.trendIcon}>
          <TrendUpIcon />
        </Icon>
      );
    } else if (value < 0) {
      return (
        <Icon status="danger" style={styles.trendIcon}>
          <TrendDownIcon />
        </Icon>
      );
    } else {
      return null;
    }
  };

  const getWarningOrTrend = (value: string, raw: number) => {
    return isMissingValue(value) ? (
      getWarning()
    ) : (
      <>
        {getTrend(raw)}
        {value}
      </>
    );
  };

  const getWarningOrValue = (value: string) => {
    return isMissingValue(value) ? getWarning() : value;
  };

  const getWarning = () => {
    return (
      <Icon status="warning">
        <ExclamationTriangleIcon />
      </Icon>
    );
  };

  const isMissingValue = value => {
    return value === undefined || value === null || `${value}`.trim().length === 0;
  };

  const cpuRequestConfig = getWarningOrValue(configFormatted?.cpuRequestConfig);
  const cpuRequestCurrent = getWarningOrValue(currentFormatted?.cpuRequestCurrent);
  const cpuRequestVariation = getWarningOrTrend(configFormatted?.cpuRequestVariation, configRaw?.cpuRequestVariation);
  const memoryRequestConfig = getWarningOrValue(configFormatted?.memoryRequestConfig);
  const memoryRequestCurrent = getWarningOrValue(currentFormatted?.memoryRequestCurrent);
  const memoryRequestVariation = getWarningOrTrend(
    configFormatted?.memoryRequestVariation,
    configRaw?.memoryRequestVariation
  );

  return {
    cpuRequestConfig,
    cpuRequestCurrent,
    cpuRequestVariation,
    memoryRequestConfig,
    memoryRequestCurrent,
    memoryRequestVariation,
  };
};
