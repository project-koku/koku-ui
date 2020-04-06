import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  ComputedReportItemType,
  ComputedReportItemValueType,
} from 'components/charts/common/chartUtils';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import {
  OcpSupplementaryDashboardTab,
  OcpSupplementaryDashboardWidget,
} from './ocpSupplementaryDashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.cost_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cost,
  details: {
    costKey: 'ocp_supplementary_dashboard.cumulative_cost_label',
    formatOptions: {
      fractionDigits: 2,
    },
    showHorizontal: true,
  },
  trend: {
    computedReportItem: ComputedReportItemType.supplementary,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {},
    titleKey: 'ocp_supplementary_dashboard.cost_trend_title',
    type: ChartType.rolling,
  },
  tabsFilter: {
    limit: 3,
  },
  topItems: {
    formatOptions: {},
  },
  availableTabs: [
    OcpSupplementaryDashboardTab.projects,
    OcpSupplementaryDashboardTab.clusters,
  ],
  chartType: DashboardChartType.cost,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const cpuWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.cpu_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.cpu,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.none,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.cpu_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const memoryWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.memory_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.memory,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.total,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.memory_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};

export const volumeWidget: OcpSupplementaryDashboardWidget = {
  id: getId(),
  titleKey: 'ocp_supplementary_dashboard.volume_title',
  reportPathsType: ReportPathsType.ocp,
  reportType: ReportType.volume,
  details: {
    formatOptions: {
      fractionDigits: 0,
    },
    requestFormatOptions: {
      fractionDigits: 0,
    },
    requestKey: 'ocp_supplementary_dashboard.requests_label',
    showUnits: true,
    showUsageFirst: true,
    usageFormatOptions: {
      fractionDigits: 0,
    },
    usageKey: 'ocp_supplementary_dashboard.usage_label',
  },
  trend: {
    computedReportItem: ComputedReportItemType.usage,
    computedReportItemValue: ComputedReportItemValueType.none,
    formatOptions: {
      fractionDigits: 2,
    },
    titleKey: 'ocp_supplementary_dashboard.volume_trend_title',
    type: ChartType.daily,
  },
  topItems: {
    formatOptions: {},
  },
  // availableTabs: [
  //   OcpSupplementaryDashboardTab.projects,
  //   OcpSupplementaryDashboardTab.clusters,
  // ],
  chartType: DashboardChartType.usage,
  currentTab: OcpSupplementaryDashboardTab.projects,
};
