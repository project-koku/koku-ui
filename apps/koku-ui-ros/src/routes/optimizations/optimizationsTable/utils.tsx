import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TrendDownIcon } from '@patternfly/react-icons/dist/esm/icons/trend-down-icon';
import { TrendUpIcon } from '@patternfly/react-icons/dist/esm/icons/trend-up-icon';
import type { Query } from 'api/queries/query';
import type { RecommendationEngine } from 'api/ros/recommendations';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import type { Location } from 'react-router-dom';
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

  const hasCpuRequestCurrent =
    typeof values?.config?.requests?.cpu?.amount === 'number' && !Number.isNaN(values.config.requests.cpu.amount);
  const hasCpuRequestVariation =
    typeof values?.variation?.requests?.cpu?.amount === 'number' && !Number.isNaN(values.variation.requests.cpu.amount);
  const hasMemoryRequestCurrent =
    typeof values?.config?.requests?.memory?.amount === 'number' && !Number.isNaN(values.config.requests.memory.amount);
  const hasMemoryRequestVariation =
    typeof values?.variation?.requests?.memory?.amount === 'number' &&
    !Number.isNaN(values.variation.requests.memory.amount);

  const cpuRequestCurrentValue = hasCpuRequestCurrent ? values.config.requests.cpu.amount : undefined;
  const cpuRequestCurrentUnits = hasCpuRequestCurrent ? values.config.requests.cpu.format : undefined;
  const cpuRequestVariationValue = hasCpuRequestVariation ? values.variation.requests.cpu.amount : undefined;
  const cpuRequestVariationUnits = hasCpuRequestVariation ? values.variation.requests.cpu.format : undefined;

  const memoryRequestCurrentValue = hasMemoryRequestCurrent ? values.config.requests.memory.amount : undefined;
  const memoryRequestCurrentUnits = hasMemoryRequestCurrent ? values.config.requests.memory.format : undefined;
  const memoryRequestVariationValue = hasMemoryRequestVariation ? values.variation.requests.memory.amount : undefined;
  const memoryRequestVariationUnits = hasMemoryRequestVariation ? values.variation.requests.memory.format : undefined;

  return {
    cpuRequestCurrent: formatValue(cpuRequestCurrentValue, cpuRequestCurrentUnits, isFormatted, isK8Units),
    cpuRequestVariation: formatValue(cpuRequestVariationValue, cpuRequestVariationUnits, isFormatted, isK8Units),
    memoryRequestCurrent: formatValue(memoryRequestCurrentValue, memoryRequestCurrentUnits, isFormatted, isK8Units),
    memoryRequestVariation: formatValue(
      memoryRequestVariationValue,
      memoryRequestVariationUnits,
      isFormatted,
      isK8Units
    ),
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

export const getRequestProps = (values: any) => {
  const configFormatted = getConfiguration(values, true, false);
  const configRaw = getConfiguration(values, false, false);

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

  const cpuRequestCurrent = getWarningOrValue(configFormatted?.cpuRequestCurrent);
  const cpuRequestVariation = getWarningOrTrend(configFormatted?.cpuRequestVariation, configRaw?.cpuRequestVariation);
  const memoryRequestCurrent = getWarningOrValue(configFormatted?.memoryRequestCurrent);
  const memoryRequestVariation = getWarningOrTrend(
    configFormatted?.memoryRequestVariation,
    configRaw?.memoryRequestVariation
  );

  return {
    cpuRequestCurrent,
    cpuRequestVariation,
    memoryRequestCurrent,
    memoryRequestVariation,
  };
};
