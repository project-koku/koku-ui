import { Card, CardBody, CardTitle, Grid, GridItem, Title, TitleSizes } from '@patternfly/react-core';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { HistoricalDataWidget } from 'store/breakdown/historicalData/common/historicalDataCommon';
import { HistoricalDataWidgetType } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { HistoricalDataCostChart } from './historicalDataCostChart';
import { HistoricalDataTrendChart } from './historicalDataTrendChart';
import { HistoricalDataUsageChart } from './historicalDataUsageChart';

interface HistoricalDataOwnProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
}

export interface HistoricalDataStateProps {
  selectWidgets?: Record<number, any>;
  widgets: number[];
}

type HistoricalDataProps = HistoricalDataOwnProps & HistoricalDataStateProps & WrappedComponentProps;

class HistoricalDatasBase extends React.Component<HistoricalDataProps, any> {
  private getTitleKey = (reportPathsType, reportType) => {
    if (reportPathsType === ReportPathsType.azure) {
      return reportType === ReportType.instanceType ? 'virtual_machine' : reportType;
    }
    return reportType === ReportType.instanceType ? 'instance_type' : reportType;
  };

  // Returns cost chart
  private getCostChart = (widget: HistoricalDataWidget) => {
    const { costDistribution, costType, currency, intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.historicalChartTitle, {
              value: this.getTitleKey(widget.reportPathsType, widget.reportType),
            })}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataCostChart
            chartName={widget.chartName}
            costDistribution={costDistribution}
            costType={costType}
            currency={currency}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns trend chart
  private getTrendChart = (widget: HistoricalDataWidget) => {
    const { costType, currency, intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.historicalChartTitle, {
              value: this.getTitleKey(widget.reportPathsType, widget.reportType),
            })}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataTrendChart
            chartName={widget.chartName}
            costType={costType}
            currency={currency}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns usage chart
  private getUsageChart = (widget: HistoricalDataWidget) => {
    const { intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.historicalChartTitle, {
              value: this.getTitleKey(widget.reportPathsType, widget.reportType),
            })}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataUsageChart
            chartName={widget.chartName}
            reportPathsType={widget.reportPathsType}
            reportType={widget.reportType}
          />
        </CardBody>
      </Card>
    );
  };

  // Returns rendered widget based on type
  private renderWidget(widget: HistoricalDataWidget) {
    switch (widget.type) {
      case HistoricalDataWidgetType.cost:
        return this.getCostChart(widget);
      case HistoricalDataWidgetType.trend:
        return this.getTrendChart(widget);
      case HistoricalDataWidgetType.usage:
        return this.getUsageChart(widget);
      default:
        return null;
    }
  }

  public render() {
    const { selectWidgets, widgets } = this.props;

    return (
      <Grid hasGutter>
        {widgets.map(widgetId => {
          const widget = selectWidgets[widgetId];
          return <GridItem key={`widget-${widgetId}`}>{this.renderWidget(widget)}</GridItem>;
        })}
      </Grid>
    );
  }
}

const HistoricalDataBase = injectIntl(HistoricalDatasBase);

export default HistoricalDataBase;
