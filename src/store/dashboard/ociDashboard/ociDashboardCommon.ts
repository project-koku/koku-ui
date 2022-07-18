import { getQuery, OciFilters, OciQuery } from 'api/queries/ociQuery';
import { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

export const ociDashboardStateKey = 'ociDashboard';
export const ociDashboardDefaultFilters: OciFilters = {
  time_scope_units: 'month',
  time_scope_value: -1,
  resolution: 'daily',
};
export const ociDashboardTabFilters: OciFilters = {
  ...ociDashboardDefaultFilters,
  limit: 3,
};

// eslint-disable-next-line no-shadow
export const enum OciDashboardTab {
  product_service = 'product_service',
  payer_tenant_ids = 'payer_tenant_ids',
  resources = 'resources',
}

export interface OciDashboardWidget extends DashboardWidget<OciDashboardTab> {}

export function getGroupByForTab(widget: OciDashboardWidget): OciQuery['group_by'] {
  switch (widget.currentTab) {
    case OciDashboardTab.product_service:
      // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
      return {
        product_service: widget.tabsFilter && widget.tabsFilter.service_name ? widget.tabsFilter.service_name : '*',
      };
    case OciDashboardTab.payer_tenant_ids:
      return { payer_tenant_id: '*' };
    case OciDashboardTab.resources:
      return { region: '*' };
    default:
      return {};
  }
}

export function getQueryForWidget(filter: OciFilters = ociDashboardDefaultFilters, props?) {
  const query: OciQuery = {
    filter,
    ...(props ? props : {}),
  };
  return getQuery(query);
}

export function getQueryForWidgetTabs(widget: OciDashboardWidget, filter: OciFilters = ociDashboardDefaultFilters) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  // Use group_by for service tab and filter for others -- https://github.com/project-koku/koku-ui/issues/846
  if (widget.currentTab === OciDashboardTab.product_service && widget.tabsFilter && widget.tabsFilter.service_name) {
    newFilter.service = undefined;
  }
  const query: OciQuery = {
    filter: newFilter,
    group_by,
  };
  return getQuery(query);
}
