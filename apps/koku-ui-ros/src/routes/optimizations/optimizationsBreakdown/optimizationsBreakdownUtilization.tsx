import './optimizationsBreakdown.scss';

import { Card, CardBody, CardTitle, Divider, Grid, GridItem, Title, TitleSizes } from '@patternfly/react-core';
import type { Recommendations } from 'api/ros/recommendations';
import { format } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { OptimizationType } from 'utils/commonTypes';
import { Interval, RecommendationType, ResourceType, UsageType } from 'utils/commonTypes';
import { getRecommendationTerm } from 'utils/recomendations';

import { OptimizationsBreakdownChart } from './optimizationsBreakdownChart';
import { chartStyles, styles } from './optimizationsBreakdownUtilization.styles';

interface OptimizationsBreakdownUtilizationOwnProps {
  currentInterval?: Interval.short_term | Interval.medium_term | Interval.long_term;
  optimizationType?: OptimizationType;
  recommendations?: Recommendations;
}

type OptimizationsBreakdownUtilizationProps = OptimizationsBreakdownUtilizationOwnProps;

const OptimizationsBreakdownUtilization: React.FC<OptimizationsBreakdownUtilizationProps> = ({
  currentInterval,
  optimizationType,
  recommendations,
}) => {
  const intl = useIntl();

  const createRecommendationDatum = (
    recommendationType: RecommendationType,
    resourceType: ResourceType,
    usageDatum
  ) => {
    const term = getRecommendationTerm(recommendations, currentInterval);
    const values = term?.recommendation_engines?.[optimizationType]?.config?.[resourceType]?.[recommendationType];

    if (!values) {
      return [];
    }

    const datum = [];
    usageDatum.forEach(data => {
      datum.push({
        ...data,
        name: resourceType === ResourceType.limits ? 'limit' : 'request',
        y: values.amount,
        units: values.format,
      });
    });
    return datum.length
      ? [
          {
            ...datum[0],
            key: undefined, // Don't use date here
            x: 0, // Extends threshold lines to chart edge
          },
          ...datum,
          {
            ...datum[0],
            key: undefined, // Don't use date here
            x: 100,
          },
        ]
      : [];
  };

  const createUsageDatum = (usageType: UsageType) => {
    const term = getRecommendationTerm(recommendations, currentInterval);
    const plotsData = term?.plots?.plots_data || [];

    const datum = [];
    for (const key of Object.keys(plotsData)) {
      const data = plotsData?.[key]?.[usageType];
      const date = new Date(key);
      const xVal = currentInterval === Interval.short_term ? format(date, 'kk:mm') : format(date, 'MMM d');
      datum.push({
        key,
        name: usageType,
        units: data?.format,
        x: xVal,
        y: data ? [data.min, data.median, data.max, data.q1, data.q3] : [null],
      });
    }
    // Pad dates if plots_data is missing
    if (datum.length === 0 && recommendations?.monitoring_end_time) {
      if (currentInterval === Interval.short_term) {
        const today = new Date(recommendations?.monitoring_end_time);
        for (let hour = 24; hour > 0; hour -= 6) {
          today.setHours(today.getHours() - hour);
          datum.push({
            key: today.toDateString(),
            name: usageType,
            x: format(today, 'kk:mm'),
            y: [null],
          });
        }
      } else {
        for (let day = currentInterval === Interval.long_term ? 15 : 7; day > 0; day--) {
          const today = new Date(recommendations?.monitoring_end_time);
          today.setDate(today.getDate() - day);
          datum.push({
            key: today.toDateString(),
            name: usageType,
            x: format(today, 'MMM d'),
            y: [null],
          });
        }
      }
    }
    return datum;
  };

  const getChart = (usageType: UsageType, recommendationType: RecommendationType) => {
    const usageDatum = createUsageDatum(usageType);
    const limitDatum = createRecommendationDatum(recommendationType, ResourceType.limits, usageDatum);
    const requestDatum = createRecommendationDatum(recommendationType, ResourceType.requests, usageDatum);

    return (
      <OptimizationsBreakdownChart
        baseHeight={chartStyles.chartHeight}
        limitData={limitDatum}
        name={`utilization-${usageType}`}
        requestData={requestDatum}
        usageData={usageDatum}
      />
    );
  };

  return (
    <Card>
      <Grid hasGutter>
        <GridItem xl={6}>
          <div style={styles.container}>
            <div style={styles.cardContainer}>
              <Card isPlain>
                <CardTitle>
                  <Title headingLevel="h2" size={TitleSizes.lg}>
                    {intl.formatMessage(messages.cpuUtilization)}
                  </Title>
                </CardTitle>
                <CardBody>{getChart(UsageType.cpuUsage, RecommendationType.cpu)}</CardBody>
              </Card>
            </div>
            <Divider
              orientation={{
                default: 'vertical',
              }}
              style={styles.dividerContainer}
            />
          </div>
        </GridItem>
        <GridItem xl={6}>
          <Card isPlain>
            <CardTitle>
              <Title headingLevel="h2" size={TitleSizes.lg}>
                {intl.formatMessage(messages.memoryUtilization)}
              </Title>
            </CardTitle>
            <CardBody>{getChart(UsageType.memoryUsage, RecommendationType.memory)}</CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Card>
  );
};

export { OptimizationsBreakdownUtilization };
