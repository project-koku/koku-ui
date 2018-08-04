import { ReportType } from 'api/reports';
import { DashboardTab, DashboardWidget } from './dashboardCommon';

let currrentId = 0;
const getId = () => currrentId++;

export const costSummaryWidget: DashboardWidget = {
  id: getId(),
  titleKey: 'dashboard_page.cost_title',
  reportType: ReportType.cost,
  details: {
    labelKey: 'dashboard_page.cost_detail_label',
    descriptionKeyRange: 'dashboard_page.cost_detail_description_range',
    descriptionKeySingle: 'dashboard_page.cost_detail_description_single',
    formatOptions: {
      fractionDigits: 0,
    },
  },
  trend: {
    titleKey: 'dashboard_page.cost_trend_title',
    formatOptions: {},
  },
  availableTabs: [
    DashboardTab.services,
    DashboardTab.accounts,
    DashboardTab.regions,
  ],
  currentTab: DashboardTab.services,
};
