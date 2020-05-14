import {
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { tagKeyPrefix } from 'api/queries/query';
import { SummaryCard } from 'pages/details/components/summary/summaryCard';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import {
  CostOverviewWidget,
  CostOverviewWidgetType,
} from 'store/costOverview/common/costOverviewCommon';

interface CostOverviewOwnProps {
  filterBy: string | number;
  groupBy: string;
}

interface CostOverviewStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type CostOverviewProps = CostOverviewOwnProps &
  CostOverviewStateProps &
  InjectedTranslateProps;

const PLACEHOLDER = 'placeholder';

class CostOverviewBase extends React.Component<CostOverviewProps> {
  // Returns cost breakdown widget
  private getCostBreakdown = (widget: CostOverviewWidget) => {
    return (
      <Card>
        <CardHeader>Cost breakdown</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns CPU usage widget
  private getCpuUsage = (widget: CostOverviewWidget) => {
    return (
      <Card>
        <CardHeader>CPU usage</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns memory usage widget
  private getMemoryUsage = (widget: CostOverviewWidget) => {
    return (
      <Card>
        <CardHeader>Memory usage</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns summary card widget
  private getSummaryCard = (widget: CostOverviewWidget) => {
    const { filterBy, groupBy } = this.props;

    let showWidget = false;
    for (const groupById of widget.reportSummary.showWidgetOnGroupBy) {
      if (
        groupById === groupBy ||
        (groupById === tagKeyPrefix && groupBy.indexOf(tagKeyPrefix) !== -1)
      ) {
        showWidget = true;
        break;
      }
    }
    if (showWidget) {
      return (
        <SummaryCard
          filterBy={filterBy}
          groupBy={widget.reportSummary.reportGroupBy}
          parentGroupBy={groupBy}
          reportPathsType={widget.reportSummary.reportPathsType}
          reportType={widget.reportSummary.reportType}
        />
      );
    } else if (widget.reportSummary.usePlaceholder) {
      return PLACEHOLDER;
    }
    return null;
  };

  // Helper to fill grid columns instead of rows, based on the order defined by the reducer
  private getWidgetsColumns = () => {
    const { selectWidgets, widgets } = this.props;

    const visibleWidgets = [];
    widgets.map(widgetId => {
      const widget = selectWidgets[widgetId];
      const renderedWidget = this.renderWidget(widget);
      if (renderedWidget !== null) {
        visibleWidgets.push(renderedWidget);
      }
    });

    const rows =
      Math.floor(visibleWidgets.length / 2) + (visibleWidgets.length % 2);
    const leftColumnWidgets = [];
    const rightColumnWidgets = [];
    for (let i = 0; i < rows; i++) {
      if (visibleWidgets[i] !== PLACEHOLDER) {
        leftColumnWidgets.push(visibleWidgets[i]);
      }
      if (i + rows < visibleWidgets.length) {
        if (visibleWidgets[i + rows] !== PLACEHOLDER) {
          rightColumnWidgets.push(visibleWidgets[i + rows]);
        }
      }
    }
    return { leftColumnWidgets, rightColumnWidgets };
  };

  // Returns rendered widget based on type
  private renderWidget(widget: CostOverviewWidget) {
    switch (widget.type) {
      case CostOverviewWidgetType.costBreakdown:
        return this.getCostBreakdown(widget);
      case CostOverviewWidgetType.cpuUsage:
        return this.getCpuUsage(widget);
      case CostOverviewWidgetType.memoryUsage:
        return this.getMemoryUsage(widget);
      case CostOverviewWidgetType.reportSummary:
        return this.getSummaryCard(widget);
      default:
        return null;
    }
  }

  public render() {
    // Sort widgets vertically
    const { leftColumnWidgets, rightColumnWidgets } = this.getWidgetsColumns();

    return (
      <Grid gutter="md">
        <GridItem lg={12} xl={6}>
          <Grid gutter="md">
            {leftColumnWidgets.map((widget, index) => {
              return <GridItem key={`widget-${index}`}>{widget}</GridItem>;
            })}
          </Grid>
        </GridItem>
        <GridItem lg={12} xl={6}>
          <Grid gutter="md">
            {rightColumnWidgets.map((widget, index) => {
              return <GridItem key={`widget-${index}`}>{widget}</GridItem>;
            })}
          </Grid>
        </GridItem>
      </Grid>
    );
  }
}

export { CostOverviewBase };
