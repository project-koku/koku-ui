import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import {
  HistoricalDataWidget,
  HistoricalDataWidgetType,
} from 'store/historicalData/common/historicalDataCommon';

// tslint:disable-next-line:no-empty-interface
interface HistoricalDataOwnProps {}

interface HistoricalDataStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type HistoricalDataProps = HistoricalDataOwnProps &
  HistoricalDataStateProps &
  InjectedTranslateProps;

class HistoricalDataBase extends React.Component<HistoricalDataProps> {
  // Returns cost chart
  private getCostChart = (widget: HistoricalDataWidget) => {
    return (
      <Card>
        <CardHeader>Cost chart</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns trend chart
  private getTrendChart = (widget: HistoricalDataWidget) => {
    return (
      <Card>
        <CardHeader>Trend chart</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns usage chart
  private getUsageChart = (widget: HistoricalDataWidget) => {
    return (
      <Card>
        <CardHeader>Usage chart</CardHeader>
        <CardBody>Card body</CardBody>
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
      <Grid gutter="md">
        {widgets.map(widgetId => {
          const widget = selectWidgets[widgetId];
          return (
            <GridItem key={`widget-${widgetId}`}>
              {this.renderWidget(widget)}
            </GridItem>
          );
        })}
      </Grid>
    );
  }
}

export { HistoricalDataBase };
