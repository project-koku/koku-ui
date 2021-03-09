import { Card, CardBody, CardTitle, Grid, GridItem, Title } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import {
  HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/breakdown/historicalData/common/historicalDataCommon';

import { HistoricalDataCostChart } from './historicalDataCostChart';
import { HistoricalDataTrendChart } from './historicalDataTrendChart';
import { HistoricalDataUsageChart } from './historicalDataUsageChart';

interface HistoricalDataOwnProps {
  // TBD...
}

interface HistoricalDataStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type HistoricalDataProps = HistoricalDataOwnProps & HistoricalDataStateProps & WithTranslation;

class HistoricalDataBase extends React.Component<HistoricalDataProps> {
  // Returns cost chart
  private getCostChart = (widget: HistoricalDataWidget) => {
    const { t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataCostChart reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns trend chart
  private getTrendChart = (widget: HistoricalDataWidget) => {
    const { t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataTrendChart reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns usage chart
  private getUsageChart = (widget: HistoricalDataWidget) => {
    const { t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size="lg">
            {t(`breakdown.historical_chart.${widget.reportType}_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <HistoricalDataUsageChart reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
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

export { HistoricalDataBase };
