import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { TrendDownIcon } from '@patternfly/react-icons/dist/esm/icons/trend-down-icon';
import { TrendUpIcon } from '@patternfly/react-icons/dist/esm/icons/trend-up-icon';
import type { Query } from 'api/queries/query';
import { intl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { formatOptimization, formatPercentage, unitsLookupKey } from 'utils/format';

import { styles } from './optimizationsTable.styles';

const formatValue = (value, units, isFormatted = true, isK8Units = false) => {
  if (!value) {
    return '';
  }

  if (units === 'percent') {
    const percentage = value ? value : 0;

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

// Helper to determine if cpu and variation are empty objects
const hasValues = (values: any, key: string) => {
  let result = false;
  if (values?.[key]) {
    result = Object.keys(values[key]).length > 0;
  }
  return result;
};

export const getConfiguration = (values: any, isFormatted: boolean, isK8Units: boolean) => {
  if (!values) {
    return undefined;
  }

  const hasCpuRequestCurrent = hasValues(values, 'cpu_request_current');
  const hasMemoryRequestCurrent = hasValues(values, 'memory_request_current');

  const cpuRequestCurrentValue = hasCpuRequestCurrent ? values.cpu_request_current.value : undefined;
  const cpuRequestCurrentUnits = hasCpuRequestCurrent ? values.cpu_request_current.format : undefined;
  const cpuVariationValue = hasCpuRequestCurrent ? values.cpu_variation.value : undefined;
  const cpuVariationUnits = hasCpuRequestCurrent ? values.cpu_variation.format : undefined;

  const memoryRequestCurrentValue = hasMemoryRequestCurrent ? values.memory_request_current.value : undefined;
  const memoryRequestCurrentUnits = hasMemoryRequestCurrent ? values.memory_request_current.format : undefined;
  const memoryVariationValue = hasMemoryRequestCurrent ? values.memory_variation.value : undefined;
  const memoryVariationUnits = hasMemoryRequestCurrent ? values.memory_variation.format : undefined;

  return {
    cpu_request_current: formatValue(cpuRequestCurrentValue, cpuRequestCurrentUnits, isFormatted, isK8Units),
    cpu_variation: formatValue(cpuVariationValue, cpuVariationUnits, isFormatted, isK8Units),
    memory_request_current: formatValue(memoryRequestCurrentValue, memoryRequestCurrentUnits, isFormatted, isK8Units),
    memory_variation: formatValue(memoryVariationValue, memoryVariationUnits, isFormatted, isK8Units),
  };
};

export const getLinkState = ({
  breadcrumbPath,
  isOptimizationsDetails,
  linkState,
  projectPath,
  optimizationsBreakdownPath,
  query = {},
}: {
  breadcrumbPath: string;
  isOptimizationsDetails?: boolean;
  linkState?: any; // Optimizations breakdown link state
  projectPath?: string; // Project path (i.e., OCP details breakdown path)
  optimizationsBreakdownPath: string; // Optimizations breakdown path
  query?: Query;
}) => {
  return {
    ...(linkState && linkState),
    // OCP details breakdown page
    details: {
      ...(linkState?.details && linkState?.details),
      ...(projectPath && {
        breadcrumbPath: optimizationsBreakdownPath, // Path back to optimizations breakdown page
      }),
    },
    // Optimizations page
    optimizations: {
      ...(linkState?.optimizations && linkState?.optimizations),
      ...(isOptimizationsDetails && {
        ...query,
        breadcrumbPath, // Path back to optimizations details page
      }),
      ...(projectPath && { projectPath }), // Path to OCP details breakdown page
    },
    // Optimizations breakdown page
    optimizationsBreakdown: {
      ...(linkState?.optimizationsBreakdown && linkState?.optimizationsBreakdown),
      ...(!isOptimizationsDetails && {
        ...query,
        breadcrumbPath, // Path back to optimizations details page
      }),
    },
  };
};

export const getRequestProps = (values: any) => {
  const configFormatted = getConfiguration(values, true, false);
  const configRaw = getConfiguration(values, false, false);

  const getTrend = value => {
    return value > 0 ? (
      <Icon status="success" style={styles.trendIcon}>
        <TrendUpIcon />
      </Icon>
    ) : (
      <Icon status="danger" style={styles.trendIcon}>
        <TrendDownIcon />
      </Icon>
    );
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
    return !value || `${value}`.trim().length === 0;
  };

  const cpuRequestCurrent = getWarningOrValue(configFormatted?.cpu_request_current);
  const cpuVariation = getWarningOrTrend(configFormatted?.cpu_variation, configRaw?.cpu_variation);
  const memoryRequestCurrent = getWarningOrValue(configFormatted?.memory_request_current);
  const memoryVariation = getWarningOrTrend(configFormatted?.memory_variation, configRaw?.memory_variation);

  return {
    cpuRequestCurrent,
    cpuVariation,
    memoryRequestCurrent,
    memoryVariation,
  };
};
