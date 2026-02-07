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
  Icon,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import type { RecommendationTerm } from 'api/ros/recommendations';
import type { Recommendations } from 'api/ros/recommendations';
import type { RecommendationValues } from 'api/ros/recommendations';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { OptimizedState } from 'routes/components/state/optimizedState';
import type { OptimizationType } from 'utils/commonTypes';
import { ConfigType, Interval } from 'utils/commonTypes';
import { formatOptimization, formatPercentage, unitsLookupKey } from 'utils/format';
import { isIntervalOptimized } from 'utils/notifications';
import { hasRecommendationValues } from 'utils/recomendations';
import YAML from 'yaml';

import { styles } from './optimizationsBreakdown.styles';

interface OptimizationsBreakdownConfigurationOwnProps {
  currentInterval?: Interval.short_term | Interval.medium_term | Interval.long_term;
  optimizationType?: OptimizationType;
  recommendations?: Recommendations;
}

type OptimizationsBreakdownConfigurationProps = OptimizationsBreakdownConfigurationOwnProps;

const OptimizationsBreakdownConfiguration: React.FC<OptimizationsBreakdownConfigurationProps> = ({
  currentInterval,
  optimizationType,
  recommendations,
}) => {
  const [copied, setCopied] = useState(false);
  const intl = useIntl();

  const formatValue = (value, units, isFormatted = true, isK8Units = false) => {
    if (!value) {
      return '';
    }

    const formattedUnits = intl.formatMessage(isK8Units ? messages.unitsK8 : messages.units, {
      units: unitsLookupKey(units),
    });

    return isFormatted
      ? intl.formatMessage(messages.optimizationsValue, {
          count: 0,
          value: formatOptimization(value),
          units: formattedUnits,
        })
      : value;
  };

  const getConfiguration = (values: RecommendationValues, isFormatted: boolean, isK8Units: boolean) => {
    if (!values) {
      return undefined;
    }

    const hasConfigLimitsCpu = hasRecommendationValues(values, 'limits', 'cpu');
    const hasConfigLimitsMemory = hasRecommendationValues(values, 'limits', 'memory');
    const hasConfigRequestsCpu = hasRecommendationValues(values, 'requests', 'cpu');
    const hasConfigRequestsMemory = hasRecommendationValues(values, 'requests', 'memory');

    const cpuConfigLimitsAmount = hasConfigLimitsCpu ? values.limits.cpu.amount : undefined;
    const cpuConfigLimitsUnits = hasConfigLimitsCpu ? values.limits.cpu.format : undefined;
    const cpuConfigRequestsAmount = hasConfigRequestsCpu ? values.requests.cpu.amount : undefined;
    const cpuConfigRequestsUnits = hasConfigRequestsCpu ? values.requests.cpu.format : undefined;

    const memConfigLimitsAmount = hasConfigLimitsMemory ? values.limits.memory.amount : undefined;
    const memConfigLimitsUnits = hasConfigLimitsMemory ? values.limits.memory.format : undefined;
    const memConfigRequestsAmount = hasConfigRequestsMemory ? values.requests.memory.amount : undefined;
    const memConfigRequestsUnits = hasConfigRequestsMemory ? values.requests.memory.format : undefined;

    return {
      limits: {
        cpu: formatValue(cpuConfigLimitsAmount, cpuConfigLimitsUnits, isFormatted, isK8Units),
        memory: formatValue(memConfigLimitsAmount, memConfigLimitsUnits, isFormatted, isK8Units),
      },
      requests: {
        cpu: formatValue(cpuConfigRequestsAmount, cpuConfigRequestsUnits, isFormatted, isK8Units),
        memory: formatValue(memConfigRequestsAmount, memConfigRequestsUnits, isFormatted, isK8Units),
      },
    };
  };

  const getCurrentConfig = (isFormatted = true) => {
    const values = recommendations?.current;

    return getConfiguration(values, isFormatted, false);
  };

  const getRecommendationTerm = (): RecommendationTerm => {
    if (!recommendations) {
      return undefined;
    }

    let result;
    switch (currentInterval) {
      case Interval.short_term:
        result = recommendations?.recommendation_terms?.short_term;
        break;
      case Interval.medium_term:
        result = recommendations?.recommendation_terms?.medium_term;
        break;
      case Interval.long_term:
        result = recommendations?.recommendation_terms?.long_term;
        break;
    }
    return result;
  };

  const getRecommendedConfig = (isFormatted = true) => {
    const term = getRecommendationTerm();
    const values = term?.recommendation_engines?.[optimizationType]?.config;

    return getConfiguration(values, isFormatted, true);
  };

  const getCurrentYaml = () => {
    const code = getCurrentConfig(true);

    // See https://eemeli.org/yaml/#tojs-options
    return code ? YAML.stringify(code).replace(/"/g, '') : undefined; // prettify
  };

  const getCurrentConfigCodeBlock = () => {
    const code = getCurrentYaml();
    if (!code) {
      return null;
    }
    return (
      <CodeBlock actions={getEmptyActions()}>
        <CodeBlockCode>
          {hasMissingValue(ConfigType.current) ? (
            <span style={styles.codeBlock}>
              <span>{getWarningConfig(ConfigType.current)}</span>
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

  const getRecommendedActions = () => {
    const code = getRecommendedYaml();

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

  const getRecommendedYaml = () => {
    let code = getRecommendedConfig();
    if (!code) {
      return undefined;
    }
    // Add change values
    code = getVariationConfig(code);

    // See https://eemeli.org/yaml/#tojs-options
    return code ? YAML.stringify(code).replace(/"/g, '') : undefined; // prettify
  };

  const getRecommendedConfigCodeBlock = () => {
    const code = getRecommendedYaml();
    if (!code) {
      return null;
    }
    return (
      <CodeBlock actions={getRecommendedActions()}>
        <CodeBlockCode>
          {hasMissingValue(ConfigType.recommended) ? (
            <span style={styles.codeBlock}>
              <span>{getWarningConfig(ConfigType.recommended)}</span>
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

  const getVariationConfig = config => {
    const term = getRecommendationTerm();
    const variation = term?.recommendation_engines?.[optimizationType]?.variation;

    // Get longest formatted string containing units
    const limitsCpuChars = `cpu: ${config.limits.cpu}`.length;
    const limitsMemoryChars = `memory: ${config.limits.memory}`.length;
    const requestsCpuChars = `cpu: ${config.requests.cpu}`.length;
    const requestsMemoryChars = `memory: ${config.requests.memory}`.length;

    // Calculate max characters in order to left-align change values
    const maxChars = Math.max(limitsCpuChars, limitsMemoryChars, requestsCpuChars, requestsMemoryChars);

    let percentage = variation?.limits?.cpu?.amount ? variation?.limits?.cpu?.amount : 0;
    const cpuVariationLimitsChange = getVariationSpacing(
      maxChars - limitsCpuChars,
      intl.formatMessage(messages.percentPlus, {
        count: percentage > 0 ? 1 : 0,
        value: formatPercentage(percentage),
      })
    );

    percentage = variation?.limits?.memory?.amount ? variation?.limits?.memory?.amount : 0;
    const memoryVariationLimitsChange = getVariationSpacing(
      maxChars - limitsMemoryChars,
      intl.formatMessage(messages.percentPlus, {
        count: percentage > 0 ? 1 : 0,
        value: formatPercentage(percentage),
      })
    );

    percentage = variation?.requests?.cpu?.amount ? variation?.requests?.cpu?.amount : 0;
    const cpuVariationRequestsChange = getVariationSpacing(
      maxChars - requestsCpuChars,
      intl.formatMessage(messages.percentPlus, {
        count: percentage > 0 ? 1 : 0,
        value: formatPercentage(percentage),
      })
    );

    percentage = variation?.requests?.memory?.amount ? variation?.requests?.memory?.amount : 0;
    const memoryVariationRequestsChange = getVariationSpacing(
      maxChars - requestsMemoryChars,
      intl.formatMessage(messages.percentPlus, {
        count: percentage > 0 ? 1 : 0,
        value: formatPercentage(percentage),
      })
    );

    const concatValue = (value, change) => {
      if (!value) {
        return '';
      }
      return `${value}${change}`;
    };

    return {
      limits: {
        cpu: concatValue(config.limits.cpu, cpuVariationLimitsChange),
        memory: concatValue(config.limits.memory, memoryVariationLimitsChange),
      },
      requests: {
        cpu: concatValue(config.requests.cpu, cpuVariationRequestsChange),
        memory: concatValue(config.requests.memory, memoryVariationRequestsChange),
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

  const getWarningConfig = (key: ConfigType.current | ConfigType.recommended) => {
    const values = key === ConfigType.current ? getCurrentConfig(false) : getRecommendedConfig(false);

    const getWarning = value => {
      return !value ? (
        <Icon status="warning">
          <ExclamationTriangleIcon />
        </Icon>
      ) : null;
    };

    return (
      <>
        <br />
        {getWarning(values?.limits.cpu)}
        <br />
        {getWarning(values?.limits.memory)}
        <br />
        <br />
        {getWarning(values?.requests.cpu)}
        <br />
        {getWarning(values?.requests.memory)}
      </>
    );
  };

  const handleClipboardCopyOnClick = (event, text) => {
    navigator.clipboard.writeText(text.toString());
    setCopied(true);
  };

  const hasMissingValue = (key: ConfigType.current | ConfigType.recommended) => {
    const values = key === ConfigType.current ? getCurrentConfig(false) : getRecommendedConfig(false);

    const isMissingValue = value => {
      return !value || `${value}`.trim().length === 0;
    };

    const cpuLimitsWarning = isMissingValue(values?.limits.cpu);
    const cpuRequestsWarning = isMissingValue(values?.requests.cpu);
    const memoryLimitsWarning = isMissingValue(values?.limits.memory);
    const memoryRequestsWarning = isMissingValue(values?.requests.memory);

    return cpuLimitsWarning || cpuRequestsWarning || memoryLimitsWarning || memoryRequestsWarning;
  };

  const isOptimized = isIntervalOptimized(recommendations, currentInterval, optimizationType);

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
          {isOptimized ? (
            <CardBody style={styles.optimizedState}>
              <OptimizedState />
            </CardBody>
          ) : (
            <>
              <CardTitle>
                <Title headingLevel="h2" size={TitleSizes.lg}>
                  {intl.formatMessage(messages.recommendedConfiguration)}
                </Title>
              </CardTitle>
              <CardBody>{getRecommendedConfigCodeBlock()}</CardBody>
            </>
          )}
        </Card>
      </GridItem>
    </Grid>
  );
};

export { OptimizationsBreakdownConfiguration };
