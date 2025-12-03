import './costOverview.scss';

import type { Query } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
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
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { CostOverviewWidget } from '../../../../store/breakdown/costOverview/common/costOverviewCommon';
import { CostOverviewWidgetType } from '../../../../store/breakdown/costOverview/common/costOverviewCommon';
import { platformCategoryKey, tagPrefix } from '../../../../utils/props';
import { Cluster } from '../../../components/cluster';
import { getGroupByCostCategory, getGroupByOrgValue, getGroupByTagKey } from '../../../utils/groupBy';
import { styles } from '../../ocpDetails/detailsHeader.styles';
import { CostBreakdownChart } from '../costBreakdownChart';
import { CostChart } from '../costChart';
import { OverheadCostChart } from '../overheadCostChart';
import { PvcChart } from '../pvcChart';
import { SummaryCard } from '../summary';
import { UsageChart } from '../usageChart';

export interface CostOverviewOwnProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
  groupBy?: string;
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
    for (const groupById of widget.showWidgetOnGroupBy) {
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
  };

  // Returns cost breakdown chart
  private getCostBreakdownChart = (widget: CostOverviewWidget) => {
    const { costDistribution, report, intl } = this.props;

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
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.markupTitle)}</p>
                  <p>{intl.formatMessage(messages.markupDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.networkUnattributedDistributed)}</p>
                  <p>{intl.formatMessage(messages.networkUnattributedDistributedDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.platformDistributed)}</p>
                  <p>{intl.formatMessage(messages.platformDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.rawCostTitle)}</p>
                  <p>{intl.formatMessage(messages.rawCostDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.storageUnattributedDistributed)}</p>
                  <p>{intl.formatMessage(messages.storageUnattributedDistributedDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.usageCostTitle)}</p>
                  <p>{intl.formatMessage(messages.usageCostDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.workerUnallocated)}</p>
                  <p>{intl.formatMessage(messages.workerUnallocatedDesc)}</p>
                  <br />
                  <a href={intl.formatMessage(messages.docsCostModelTerminology)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.learnMore)}
                  </a>
                  <a href={intl.formatMessage(messages.docsCostModelTerminology)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.learnMore)}
                  </a>
                </>
              }
            >
              <Button icon={<OutlinedQuestionCircleIcon style={styles.info} />} variant={ButtonVariant.plain}></Button>
            </Popover>
          </Title>
        </CardTitle>
        <CardBody>
          <CostBreakdownChart costDistribution={costDistribution} id={widget.chartName} report={report} />
        </CardBody>
      </Card>
    );
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
              <Button icon={<OutlinedQuestionCircleIcon style={styles.info} />} variant={ButtonVariant.plain}></Button>
            </Popover>
          </Title>
        </CardTitle>
        <CardBody>
          <CostChart name={widget.chartName} report={report} />
        </CardBody>
      </Card>
    );
  };

  // Returns cost overhead chart
  private getCostOverheadChart = (widget: CostOverviewWidget) => {
    const { costDistribution, intl, report } = this.props;

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
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.networkUnattributedDistributed)}</p>
                  <p>{intl.formatMessage(messages.networkUnattributedDistributedDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.platformDistributed)}</p>
                  <p>{intl.formatMessage(messages.platformDesc)}</p>
                  <br />
                  <p style={styles.infoTitle}>{intl.formatMessage(messages.storageUnattributedDistributed)}</p>
                  <p>{intl.formatMessage(messages.storageUnattributedDistributedDesc)}</p>
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
              <Button icon={<OutlinedQuestionCircleIcon style={styles.info} />} variant={ButtonVariant.plain}></Button>
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
    const { groupBy, intl } = this.props;

    return (
      <Card className={groupBy === 'node' ? 'cardOverride' : undefined}>
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
    const { groupBy, intl } = this.props;

    return (
      <Card className={groupBy === 'node' ? 'cardOverride' : undefined}>
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

  // Returns PVC (persistent volume claim) chart
  private getPvcChart = (widget: CostOverviewWidget) => {
    const { groupBy, intl } = this.props;

    let showWidget = false;
    if (widget.showWidgetOnGroupBy) {
      for (const groupById of widget.showWidgetOnGroupBy) {
        if (groupById === groupBy) {
          showWidget = true;
          break;
        }
      }
    }
    if (showWidget) {
      return (
        <Card className={groupBy === 'node' ? 'cardOverride' : undefined}>
          <CardTitle>
            <Title headingLevel="h2" size={TitleSizes.lg}>
              {intl.formatMessage(messages.pvcTitle)}
            </Title>
          </CardTitle>
          <CardBody>
            <PvcChart name={widget.chartName} reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  // Returns report summary card
  private getReportSummaryCard = (widget: CostOverviewWidget) => {
    const { costDistribution, costType, currency, groupBy, isPlatformCosts, query } = this.props;

    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTag = getGroupByTagKey(query);

    let showWidget = false;
    let showPlatformCosts = false;

    if (widget.showWidgetOnGroupBy) {
      for (const groupById of widget.showWidgetOnGroupBy) {
        if (groupById === groupBy || groupByCostCategory || groupByOrg || groupByTag) {
          showWidget = true;
          break;
        }
      }
    }
    if (!showWidget && widget.showWidgetOnPlatformCategory) {
      for (const categoryId of widget.showWidgetOnPlatformCategory) {
        if (isPlatformCosts && categoryId === platformCategoryKey) {
          showWidget = true;
          showPlatformCosts = true;
          break;
        }
      }
    }
    if (showWidget) {
      const isVolumeWidget = widget.reportType === ReportType.volume;
      return (
        <SummaryCard
          costDistribution={!isVolumeWidget ? costDistribution : undefined}
          costType={!isVolumeWidget ? costType : undefined}
          currency={currency}
          isPlatformCosts={showPlatformCosts}
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
    const { groupBy, intl } = this.props;

    let showWidget = false;

    if (widget.showWidgetOnGroupBy) {
      for (const groupById of widget.showWidgetOnGroupBy) {
        if (groupById === groupBy || (groupById === tagPrefix && groupBy && groupBy.indexOf(tagPrefix) !== -1)) {
          showWidget = true;
          break;
        }
      }
    }
    if (showWidget) {
      return (
        <Card className={groupBy === 'node' ? 'cardOverride' : undefined}>
          <CardTitle>
            <Title headingLevel="h2" size={TitleSizes.lg}>
              {intl.formatMessage(messages.volumeTitle)}
            </Title>
          </CardTitle>
          <CardBody>
            <UsageChart
              name={widget.chartName}
              reportPathsType={widget.reportPathsType}
              reportType={widget.reportType}
            />
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  // Helper to fill grid columns instead of rows, based on the order defined by the reducer
  private getWidgetsColumns = () => {
    const { selectWidgets, widgets } = this.props;

    const visibleWidgets = [];
    let chartWidgetCount = 0;

    widgets.map(widgetId => {
      const widget = selectWidgets[widgetId];
      const renderedWidget = this.renderWidget(widget);
      if (renderedWidget !== null && renderedWidget !== PLACEHOLDER) {
        visibleWidgets.push(renderedWidget);
        if (
          widget.type === CostOverviewWidgetType.cpuUsage ||
          widget.type === CostOverviewWidgetType.memoryUsage ||
          widget.type === CostOverviewWidgetType.pvc ||
          widget.type === CostOverviewWidgetType.volumeUsage
        ) {
          chartWidgetCount++;
        }
      }
    });

    // Ensure all charts appear in the right column
    const rows = Math.floor(visibleWidgets.length / 2) + (visibleWidgets.length % 2);
    const midIndex = chartWidgetCount > 0 ? visibleWidgets.length - chartWidgetCount : rows;

    const leftColumnWidgets = visibleWidgets.slice(0, midIndex);
    const rightColumnWidgets = visibleWidgets.slice(midIndex, visibleWidgets.length);

    return { leftColumnWidgets, rightColumnWidgets };
  };

  // Returns rendered widget based on type
  private renderWidget(widget: CostOverviewWidget) {
    switch (widget.type) {
      case CostOverviewWidgetType.cluster:
        return this.getClusterCard(widget);
      case CostOverviewWidgetType.cost:
        return this.getCostChart(widget);
      case CostOverviewWidgetType.costBreakdown:
        return this.getCostBreakdownChart(widget);
      case CostOverviewWidgetType.costDistribution:
        return this.getCostOverheadChart(widget);
      case CostOverviewWidgetType.cpuUsage:
        return this.getCpuUsageChart(widget);
      case CostOverviewWidgetType.memoryUsage:
        return this.getMemoryUsageChart(widget);
      case CostOverviewWidgetType.pvc:
        return this.getPvcChart(widget);
      case CostOverviewWidgetType.reportSummary:
        return this.getReportSummaryCard(widget);
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
