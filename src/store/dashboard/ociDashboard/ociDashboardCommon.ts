import type { OciFilters, OciQuery } from 'api/queries/ociQuery';
import { getQuery } from 'api/queries/ociQuery';
import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';

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
  product_services = 'product_services',
  payer_tenant_ids = 'payer_tenant_ids',
  regions = 'regions',
}

export interface OciDashboardWidget extends DashboardWidget {}

export function getGroupByForTab(widget: OciDashboardWidget): OciQuery['group_by'] {
  switch (widget.currentTab) {
    case OciDashboardTab.product_services:
      return {
        product_service:
          widget.tabsFilter && widget.tabsFilter.product_service ? widget.tabsFilter.product_service : '*',
      };
    case OciDashboardTab.payer_tenant_ids:
      return { payer_tenant_id: '*' };
    case OciDashboardTab.regions:
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

export function getQueryForWidgetTabs(
  widget: OciDashboardWidget,
  filter: OciFilters = ociDashboardDefaultFilters,
  props?
) {
  const group_by = getGroupByForTab(widget);
  const newFilter = {
    ...JSON.parse(JSON.stringify(filter)),
  };

  if (
    widget.currentTab === OciDashboardTab.product_services &&
    widget.tabsFilter &&
    widget.tabsFilter.product_service
  ) {
    newFilter.service = undefined;
  }
  const query: OciQuery = {
    filter: newFilter,
    group_by,
    ...(props ? props : {}),
  };
  return getQuery(query);
}
