import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Popover,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { orgUnitIdKey, Query, tagPrefix } from 'api/queries/query';
import { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Cluster } from 'routes/views/details/components/cluster/cluster';
import { CostChart } from 'routes/views/details/components/costChart/costChart';
import { SummaryCard } from 'routes/views/details/components/summary/summaryCard';
import { UsageChart } from 'routes/views/details/components/usageChart/usageChart';
import { styles } from 'routes/views/details/ocpDetails/detailsHeader.styles';
import { CostOverviewWidget, CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';

interface CostOverviewOwnProps {
  costType?: string;
  currency?: string;
  groupBy: string;
  query?: Query;
  report: Report;
}

interface CostOverviewStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type CostOverviewProps = CostOverviewOwnProps & CostOverviewStateProps & WrappedComponentProps;

const PLACEHOLDER = 'placeholder';

class CostOverviewsBase extends React.Component<CostOverviewProps> {
  // Returns cluster chart
  private getClusterChart = (widget: CostOverviewWidget) => {
    const { groupBy, report, intl } = this.props;

    let showWidget = false;
    for (const groupById of widget.cluster.showWidgetOnGroupBy) {
      if (groupById === groupBy || (groupById === tagPrefix && groupBy.indexOf(tagPrefix) !== -1)) {
        showWidget = true;
        break;
      }
    }
    if (showWidget) {
      return (
        <Card>
          <CardTitle>
            <Title headingLevel="h2" size={TitleSizes.lg}>
              {intl.formatMessage(messages.clusters)}
            </Title>
          </CardTitle>
          <CardBody>
            <Cluster groupBy={widget.cluster.reportGroupBy} report={report} />
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  // Returns cost breakdown chart
  private getCostChart = (widget: CostOverviewWidget) => {
    const { report, intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.breakdownCostBreakdownTitle)}
            <Popover
              aria-label={intl.formatMessage(messages.breakdownCostBreakdownAriaLabel)}
              enableFlip
              bodyContent={
                <>
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.rawCostTitle)}</p>
                  <p>{intl.formatMessage(messages.rawCostDescription)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.usageCostTitle)}</p>
                  <p>{intl.formatMessage(messages.usageCostDescription)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.markupTitle)}</p>
                  <p>{intl.formatMessage(messages.markupDescription)}</p>
                  <br />
                  <a href={intl.formatMessage(messages.docsCostModelTerminology)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.learnMore)}
                  </a>
                </>
              }
            >
              <Button variant={ButtonVariant.plain}>
                <OutlinedQuestionCircleIcon style={styles.info} />
              </Button>
            </Popover>
          </Title>
        </CardTitle>
        <CardBody>
          <CostChart name={widget.chartName} report={report} />
        </CardBody>
      </Card>
    );
  };

  // Returns CPU usage chart
  private getCpuUsageChart = (widget: CostOverviewWidget) => {
    const { intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.cpuTitle)}
          </Title>
        </CardTitle>
        <CardBody>
          <UsageChart name={widget.chartName} reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns memory usage chart
  private getMemoryUsageChart = (widget: CostOverviewWidget) => {
    const { intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.memoryTitle)}
          </Title>
        </CardTitle>
        <CardBody>
          <UsageChart name={widget.chartName} reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns summary card widget
  private getSummaryCard = (widget: CostOverviewWidget) => {
    const { costType, currency, groupBy, query } = this.props;

    let showWidget = false;
    for (const groupById of widget.reportSummary.showWidgetOnGroupBy) {
      if (
        groupById === groupBy ||
        (query && query.group_by && query.group_by[orgUnitIdKey]) ||
        (groupById === tagPrefix && groupBy && groupBy.indexOf(tagPrefix) !== -1)
      ) {
        showWidget = true;
        break;
      }
    }
    if (showWidget) {
      return (
        <SummaryCard
          costType={costType}
          currency={currency}
          reportGroupBy={widget.reportSummary.reportGroupBy}
          reportPathsType={widget.reportPathsType}
          reportType={widget.reportType}
        />
      );
    } else if (widget.reportSummary.usePlaceholder) {
      return PLACEHOLDER;
    }
    return null;
  };

  // Returns volume usage chart
  private getVolumeUsageChart = (widget: CostOverviewWidget) => {
    const { intl } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.volumeTitle)}
          </Title>
        </CardTitle>
        <CardBody>
          <UsageChart name={widget.chartName} reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
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

    const rows = Math.floor(visibleWidgets.length / 2) + (visibleWidgets.length % 2);
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
      case CostOverviewWidgetType.cluster:
        return this.getClusterChart(widget);
      case CostOverviewWidgetType.cost:
        return this.getCostChart(widget);
      case CostOverviewWidgetType.cpuUsage:
        return this.getCpuUsageChart(widget);
      case CostOverviewWidgetType.memoryUsage:
        return this.getMemoryUsageChart(widget);
      case CostOverviewWidgetType.reportSummary:
        return this.getSummaryCard(widget);
      case CostOverviewWidgetType.volumeUsage:
        return this.getVolumeUsageChart(widget);
      default:
        return null;
    }
  }

  public render() {
    // Sort widgets vertically
    const { leftColumnWidgets, rightColumnWidgets } = this.getWidgetsColumns();

    return (
      <Grid hasGutter>
        <GridItem lg={12} xl={6}>
          <Grid hasGutter>
            {leftColumnWidgets.map((widget, index) => {
              return <GridItem key={`widget-${index}`}>{widget}</GridItem>;
            })}
          </Grid>
        </GridItem>
        <GridItem lg={12} xl={6}>
          <Grid hasGutter>
            {rightColumnWidgets.map((widget, index) => {
              return <GridItem key={`widget-${index}`}>{widget}</GridItem>;
            })}
          </Grid>
        </GridItem>
      </Grid>
    );
  }
}

const CostOverviewBase = injectIntl(CostOverviewsBase);

export { CostOverviewBase };
