import './optimizationsBreakdown.scss';

import {
  Card,
  CardBody,
  CardTitle,
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  CodeBlockCode,
  Grid,
  GridItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { RecommendationItem } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { formatOptimization, formatPercentage } from 'utils/format';
import { hasRecommendationValues } from 'utils/recomendations';
import YAML from 'yaml';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownConfigurationOwnProps {
  term: RecommendationItem;
}

type OptimizationsBreakdownConfigurationProps = OptimizationsBreakdownConfigurationOwnProps;

const OptimizationsBreakdownConfiguration: React.FC<OptimizationsBreakdownConfigurationProps> = ({ term }) => {
  const [copied, setCopied] = useState(false);
  const intl = useIntl();

  const getConfig = (key: 'config' | 'current', isFormatted = true, isUnitsOnly = false) => {
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

    const formatValue = (value, units) => {
      if (!value) {
        return '';
      }
      return isFormatted
        ? intl.formatMessage(messages.optimizationsValue, {
            value: formatOptimization(value),
            units,
          })
        : isUnitsOnly
        ? units
        : value;
    };
    return {
      resources: {
        limits: {
          cpu: formatValue(cpuConfigLimitsAmount, cpuConfigLimitsUnits),
          memory: formatValue(memConfigLimitsAmount, memConfigLimitsUnits),
        },
        requests: {
          cpu: formatValue(cpuConfigRequestsAmount, cpuConfigRequestsUnits),
          memory: formatValue(memConfigRequestsAmount, memConfigRequestsUnits),
        },
      },
    };
  };

  const getCurrentConfig = () => {
    const code = getConfig('current');

    // See https://eemeli.org/yaml/#tojs-options
    return YAML.stringify(code).replace(/"/g, ''); // prettify
  };

  const getCurrentConfigCodeBlock = () => {
    const code = getCurrentConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getEmptyActions()}>
        <CodeBlockCode>
          {hasMissingValue('current') ? (
            <span style={styles.codeBlock}>
              <span>{getWarningConfig('current')}</span>
              <span>&nbsp;</span>
              <span>{code}</span>
            </span>
          ) : (
            code
          )}
        </CodeBlockCode>
      </CodeBlock>
    );
  };

  // Returns empty element to force a header
  const getEmptyActions = () => {
    return <div style={styles.currentActions} />;
  };

  const getPercentage = (oldNumber: number, newNumber: number) => {
    if (typeof oldNumber !== 'number' || typeof newNumber !== 'number') {
      return 0;
    }
    const changeValue = newNumber - oldNumber;
    return (changeValue / oldNumber) * 100;
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
    let code = getConfig('config');
    if (code === null) {
      return null;
    }
    // Add change values
    code = getVariationConfig(code);

    // See https://eemeli.org/yaml/#tojs-options
    return YAML.stringify(code).replace(/"/g, ''); // prettify
  };

  const getRecommendedConfigCodeBlock = () => {
    const code = getRecommendedConfig();
    if (code === null) {
      return null;
    }
    return (
      <CodeBlock actions={getRecommendedActions()}>
        <CodeBlockCode>
          {hasMissingValue('config') ? (
            <span style={styles.codeBlock}>
              <span>{getWarningConfig('config')}</span>
              <span>&nbsp;</span>
              <span>{code}</span>
            </span>
          ) : (
            code
          )}
        </CodeBlockCode>
      </CodeBlock>
    );
  };

  const getVariationChange = (key1: 'limits' | 'requests', key2: 'cpu' | 'memory') => {
    const currentValues = getConfig('current', false);
    const currentUnits = getConfig('current', false, true);
    const recommendedValues = getConfig('config', false);
    const recommendedUnits = getConfig('config', false, true);

    let currentVal = currentValues.resources[key1][key2];
    let recommendedVal = recommendedValues.resources[key1][key2];

    // Convert millicores to cores
    if (currentUnits.resources[key1][key2] === 'cores' && recommendedUnits.resources[key1][key2] === 'millicores') {
      recommendedVal = recommendedValues.resources[key1][key2] / 1000;
    } else if (
      currentUnits.resources[key1][key2] === 'millicores' &&
      recommendedUnits.resources[key1][key2] === 'cores'
    ) {
      currentVal = currentValues.resources[key1][key2] / 1000;
    }

    // Calculate percentage change
    const percentage = getPercentage(currentVal, recommendedVal);
    return intl.formatMessage(messages.percentPlus, {
      count: percentage > 0 ? 1 : 0,
      value: formatPercentage(percentage),
    });
  };

  const getVariationConfig = config => {
    // Get longest formatted string containing units
    const limitsCpuChars = `cpu: ${config.resources.limits.cpu}`.length;
    const limitsMemoryChars = `memory: ${config.resources.limits.memory}`.length;
    const requestsCpuChars = `cpu: ${config.resources.requests.cpu}`.length;
    const requestsMemoryChars = `memory: ${config.resources.requests.memory}`.length;

    // Calculate max characters in order to left-align change values
    const maxChars = Math.max(limitsCpuChars, limitsMemoryChars, requestsCpuChars, requestsMemoryChars);

    const cpuVariationLimitsChange = getVariationSpacing(
      maxChars - limitsCpuChars,
      getVariationChange('limits', 'cpu')
    );
    const memoryVariationLimitsChange = getVariationSpacing(
      maxChars - limitsMemoryChars,
      getVariationChange('limits', 'memory')
    );
    const cpuVariationRequestsChange = getVariationSpacing(
      maxChars - requestsCpuChars,
      getVariationChange('requests', 'cpu')
    );
    const memoryVariationRequestsChange = getVariationSpacing(
      maxChars - requestsMemoryChars,
      getVariationChange('requests', 'memory')
    );

    const formatValue = (value, change) => {
      if (!value) {
        return '';
      }
      return `${value}${change}`;
    };
    return {
      resources: {
        limits: {
          cpu: formatValue(config.resources.limits.cpu, cpuVariationLimitsChange),
          memory: formatValue(config.resources.limits.memory, memoryVariationLimitsChange),
        },
        requests: {
          cpu: formatValue(config.resources.requests.cpu, cpuVariationRequestsChange),
          memory: formatValue(config.resources.requests.memory, memoryVariationRequestsChange),
        },
      },
    };
  };

  const getVariationSpacing = (count: number, value) => {
    if (!value) {
      return '';
    }
    let spacing = '  # ';
    for (let i = 0; i < count; i++) {
      spacing = ` ${spacing}`;
    }
    return `${spacing}${value}`;
  };

  const getWarningConfig = (key: 'current' | 'config') => {
    const config = getConfig(key, false);

    const getWarning = value => {
      return !value ? <ExclamationTriangleIcon color="orange" /> : null;
    };

    return (
      <>
        <br />
        <br />
        {getWarning(config.resources.limits.cpu)}
        <br />
        {getWarning(config.resources.limits.memory)}
        <br />
        <br />
        {getWarning(config.resources.requests.cpu)}
        <br />
        {getWarning(config.resources.requests.memory)}
      </>
    );
  };

  const handleClipboardCopyOnClick = (event, text) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
  };

  const hasMissingValue = (key: 'config' | 'current') => {
    const config = getConfig(key, false);

    const isMissingValue = value => {
      return !value || `${value}`.trim().length === 0;
    };

    const cpuLimitsWarning = isMissingValue(config.resources.limits.cpu);
    const cpuRequestsWarning = isMissingValue(config.resources.requests.cpu);
    const memoryLimitsWarning = isMissingValue(config.resources.limits.memory);
    const memoryRequestsWarning = isMissingValue(config.resources.requests.memory);

    return cpuLimitsWarning || cpuRequestsWarning || memoryLimitsWarning || memoryRequestsWarning;
  };

  return (
    <Grid hasGutter>
      <GridItem xl={6}>
        <Card>
          <CardTitle>
            <Title headingLevel="h2" size={TitleSizes.lg}>
              {intl.formatMessage(messages.currentConfiguration)}
            </Title>
          </CardTitle>
          <CardBody>{getCurrentConfigCodeBlock()}</CardBody>
        </Card>
      </GridItem>
      <GridItem xl={6}>
        <Card>
          <CardTitle>
            <Title headingLevel="h2" size={TitleSizes.lg}>
              {intl.formatMessage(messages.recommendedConfiguration)}
            </Title>
          </CardTitle>
          <CardBody>{getRecommendedConfigCodeBlock()}</CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export { OptimizationsBreakdownConfiguration };
