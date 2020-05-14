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
  DetailsWidget,
  DetailsWidgetType,
} from 'store/details/common/detailsCommon';

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
  private getCostBreakdown = (widget: DetailsWidget) => {
    return (
      <Card>
        <CardHeader>Cost breakdown</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns CPU usage widget
  private getCpuUsage = (widget: DetailsWidget) => {
    return (
      <Card>
        <CardHeader>CPU usage</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns memory usage widget
  private getMemoryUsage = (widget: DetailsWidget) => {
    return (
      <Card>
        <CardHeader>Memory usage</CardHeader>
        <CardBody>Card body</CardBody>
      </Card>
    );
  };

  // Returns summary card widget
  private getSummaryCard = (widget: DetailsWidget) => {
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
  private renderWidget(widget: DetailsWidget) {
    switch (widget.type) {
      case DetailsWidgetType.costBreakdown:
        return this.getCostBreakdown(widget);
      case DetailsWidgetType.cpuUsage:
        return this.getCpuUsage(widget);
      case DetailsWidgetType.memoryUsage:
        return this.getMemoryUsage(widget);
      case DetailsWidgetType.reportSummary:
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
