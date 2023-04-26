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
import type { Query } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Cluster } from 'routes/views/details/components/cluster';
import { CostChart } from 'routes/views/details/components/costChart';
import { OverheadCostChart } from 'routes/views/details/components/overheadCostChart';
import { SummaryCard } from 'routes/views/details/components/summary';
import { UsageChart } from 'routes/views/details/components/usageChart';
import { styles } from 'routes/views/details/ocpDetails/detailsHeader.styles';
import { getGroupByCostCategory, getGroupByOrgValue, getGroupByTagKey } from 'routes/views/utils/groupBy';
import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';
import { platformCategoryKey, tagPrefix } from 'utils/props';

interface CostOverviewOwnProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
  groupBy: string;
  isPlatformCosts?: boolean;
  query?: Query;
  report: Report;
}

export interface CostOverviewStateProps {
  selectWidgets?: Record<number, any>;
  title?: string;
  widgets: number[];
}

type CostOverviewProps = CostOverviewOwnProps & CostOverviewStateProps & WrappedComponentProps;

const PLACEHOLDER = 'placeholder';

class CostOverviewsBase extends React.Component<CostOverviewProps, any> {
  // Returns cluster card
  private getClusterCard = (widget: CostOverviewWidget) => {
    const { groupBy, intl, report, title } = this.props;

    let showWidget = false;
    for (const groupById of widget.cluster.showWidgetOnGroupBy) {
      if (groupById === groupBy || (groupById === tagPrefix && groupBy && groupBy.indexOf(tagPrefix) !== -1)) {
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
            <Cluster groupBy={widget.cluster.reportGroupBy} report={report} title={title} />
          </CardBody>
        </Card>
      );
    } else {
      return PLACEHOLDER;
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
            {intl.formatMessage(messages.costBreakdownTitle)}
            <Popover
              aria-label={intl.formatMessage(messages.costBreakdownAriaLabel)}
              enableFlip
              bodyContent={
                <>
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.rawCostTitle)}</p>
                  <p>{intl.formatMessage(messages.rawCostDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.usageCostTitle)}</p>
                  <p>{intl.formatMessage(messages.usageCostDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.markupTitle)}</p>
                  <p>{intl.formatMessage(messages.markupDesc)}</p>
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

  // Returns cost distribution chart
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private getCostDistributionChart = (widget: CostOverviewWidget) => {
    const { costDistribution, report, intl } = this.props;

    if (!costDistribution) {
      return null;
    }
    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {intl.formatMessage(messages.costDistributionTitle)}
            <Popover
              aria-label={intl.formatMessage(messages.costDistributionAriaLabel)}
              enableFlip
              bodyContent={
                <>
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.platformDistributed)}</p>
                  <p>{intl.formatMessage(messages.platformDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.workerUnallocated)}</p>
                  <p>{intl.formatMessage(messages.workerUnallocatedDesc)}</p>
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
          <OverheadCostChart costDistribution={costDistribution} name={widget.chartName} report={report} />
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
    const { costDistribution, costType, currency, groupBy, isPlatformCosts, query } = this.props;

    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTag = getGroupByTagKey(query);
    let showWidget = false;

    if (widget.reportSummary.showWidgetOnGroupBy) {
      for (const groupById of widget.reportSummary.showWidgetOnGroupBy) {
        if (groupById === groupBy || groupByCostCategory || groupByOrg || groupByTag) {
          showWidget = true;
          break;
        }
      }
    }
    if (!showWidget && widget.reportSummary.showWidgetOnPlatformCategory) {
      for (const categoryId of widget.reportSummary.showWidgetOnPlatformCategory) {
        if (isPlatformCosts && categoryId === platformCategoryKey) {
          showWidget = true;
          break;
        }
      }
    }
    if (showWidget) {
      return (
        <SummaryCard
          costDistribution={costDistribution}
          costType={costType}
          currency={currency}
          isPlatformCosts={isPlatformCosts}
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
        return this.getClusterCard(widget);
      case CostOverviewWidgetType.cost:
        return this.getCostChart(widget);
      case CostOverviewWidgetType.costDistribution:
        return this.getCostDistributionChart(widget);
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
        <GridItem xl={12} xl2={6}>
          <Grid hasGutter>
            {leftColumnWidgets.map((widget, index) => {
              return <GridItem key={`widget-${index}`}>{widget}</GridItem>;
            })}
          </Grid>
        </GridItem>
        <GridItem xl={12} xl2={6}>
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

export default CostOverviewBase;
