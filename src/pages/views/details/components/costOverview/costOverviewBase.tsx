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
import { Cluster } from 'pages/views/details/components/cluster/cluster';
import { CostChart } from 'pages/views/details/components/costChart/costChart';
import { SummaryCard } from 'pages/views/details/components/summary/summaryCard';
import { UsageChart } from 'pages/views/details/components/usageChart/usageChart';
import { styles } from 'pages/views/details/ocpDetails/detailsHeader.styles';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { CostOverviewWidget, CostOverviewWidgetType } from 'store/breakdown/costOverview/common/costOverviewCommon';

interface CostOverviewOwnProps {
  groupBy: string;
  query?: Query;
  report: Report;
}

interface CostOverviewStateProps {
  selectWidgets?: () => void;
  widgets: number[];
}

type CostOverviewProps = CostOverviewOwnProps & CostOverviewStateProps & WithTranslation;

const PLACEHOLDER = 'placeholder';

class CostOverviewBase extends React.Component<CostOverviewProps> {
  // Returns cluster chart
  private getClusterChart = (widget: CostOverviewWidget) => {
    const { groupBy, report, t } = this.props;

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
              {t('breakdown.cluster_title')}
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
  private getCostChart = () => {
    const { report, t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {t('breakdown.cost_breakdown_title')}
            <Popover
              aria-label={t('breakdown.cost_breakdown_aria_label')}
              enableFlip
              bodyContent={
                <>
                  <p style={styles.infoTitle}>{t('breakdown.raw_cost_title')}</p>
                  <p>{t('breakdown.raw_cost_desc')}</p>
                  <br />
                  <p style={styles.infoTitle}>{t('breakdown.usage_cost_title')}</p>
                  <p>{t('breakdown.usage_cost_desc')}</p>
                  <br />
                  <p style={styles.infoTitle}>{t('breakdown.markup_title')}</p>
                  <p>{t('breakdown.markup_desc')}</p>
                  <br />
                  <a href={t('docs.cost_model_terminology')} rel="noreferrer" target="_blank">
                    {t('learn_more')}
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
          <CostChart report={report} />
        </CardBody>
      </Card>
    );
  };

  // Returns CPU usage chart
  private getCpuUsageChart = (widget: CostOverviewWidget) => {
    const { t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {t(`breakdown.cpu_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <UsageChart reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns memory usage chart
  private getMemoryUsageChart = (widget: CostOverviewWidget) => {
    const { t } = this.props;

    return (
      <Card>
        <CardTitle>
          <Title headingLevel="h2" size={TitleSizes.lg}>
            {t(`breakdown.memory_title`)}
          </Title>
        </CardTitle>
        <CardBody>
          <UsageChart reportPathsType={widget.reportPathsType} reportType={widget.reportType} />
        </CardBody>
      </Card>
    );
  };

  // Returns summary card widget
  private getSummaryCard = (widget: CostOverviewWidget) => {
    const { groupBy, query } = this.props;

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
        return this.getCostChart();
      case CostOverviewWidgetType.cpuUsage:
        return this.getCpuUsageChart(widget);
      case CostOverviewWidgetType.memoryUsage:
        return this.getMemoryUsageChart(widget);
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

export { CostOverviewBase };
