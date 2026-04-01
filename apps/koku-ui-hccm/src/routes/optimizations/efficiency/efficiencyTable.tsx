import 'routes/components/dataTable/dataTable.scss';

import { Label, Tooltip } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import type { Query } from 'api/queries/query';
import type { OcpReport, OcpReportItem } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Actions } from 'routes/details/components/actions';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getBreakdownPath } from 'routes/utils/paths';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dates';
import { formatCurrency, formatPercentage } from 'utils/format';
import {
  classificationDefault,
  classificationPlatform,
  classificationUnallocated,
  classificationUnattributed,
  noPrefix,
} from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface EfficiencyTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  basePath?: string;
  breadcrumbPath?: string;
  exclude?: any;
  filterBy?: any;
  groupBy: string;
  isLoading?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: OcpReport;
  reportQueryString: string;
  timeScopeValue?: number;
}

interface EfficiencyTableState {
  columns?: any[];
  rows?: any[];
}

type EfficiencyTableProps = EfficiencyTableOwnProps;

export const EfficiencyTableColumnIds = {
  infrastructure: 'infrastructure',
  monthOverMonth: 'monthOverMonth',
  supplementary: 'supplementary',
};

const reportPathsType = ReportPathsType.ocp;

class EfficiencyTableBase extends React.Component<EfficiencyTableProps, EfficiencyTableState> {
  public state: EfficiencyTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: EfficiencyTableProps) {
    const { report, timeScopeValue } = this.props;
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

    if (previousReport !== currentReport || timeScopeValue !== prevProps.timeScopeValue) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { basePath, breadcrumbPath, groupBy, intl, query, report, router } = this.props;
    if (!report) {
      return;
    }

    const isGroupByProject = groupBy === 'project';

    const rows = [];
    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: groupBy as any,
    });

    const columns = [
      {
        name: '',
      },
      {
        orderBy: groupBy,
        name: intl.formatMessage(messages.detailsResourceNames, { value: groupBy }),
        ...(computedItems.length && { isSortable: true }),
        style: isGroupByProject ? styles.nameColumn : undefined,
      },
      {
        hidden: !isGroupByProject,
        name: '', // Default & Overhead column
      },
      {
        hidden: !isGroupByProject,
        name: intl.formatMessage(messages.optimizations),
      },
      {
        id: EfficiencyTableColumnIds.monthOverMonth,
        name: intl.formatMessage(messages.monthOverMonthChange),
      },
      {
        id: EfficiencyTableColumnIds.infrastructure,
        orderBy: 'infrastructure_cost',
        name: intl.formatMessage(messages.ocpDetailsInfrastructureCost),
        style: styles.managedColumn,

        // Sort by infrastructure_cost is not supported -- https://github.com/project-koku/koku/issues/796
        // ...(computedItems.length && { isSortable: true }),
      },
      {
        id: EfficiencyTableColumnIds.supplementary,
        orderBy: 'supplementary_cost',
        name: intl.formatMessage(messages.ocpDetailsSupplementaryCost),
        style: styles.managedColumn,

        // Sort by supplementary_cost is not supported -- https://github.com/project-koku/koku/issues/796
        // ...(computedItems.length && { isSortable: true }),
      },
      {
        orderBy: 'cost',
        name: intl.formatMessage(messages.cost),
        style: styles.costColumn,
        ...(computedItems.length && { isSortable: true }),
      },
      {
        name: '',
      },
    ];

    computedItems.map((item, index) => {
      const cost = this.getTotalCost(item, index);
      const label = item?.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const supplementaryCost = this.getSupplementaryCost(item, index);
      const InfrastructureCost = this.getInfrastructureCost(item, index);
      const isDefaultProject = item.classification === classificationDefault;
      const isPlatformCosts = item.classification === classificationPlatform;
      const isUnallocatedProject = item.classification === classificationUnallocated;
      const isUnattributedCosts = item.classification === classificationUnattributed;
      const isOverheadCosts =
        !isUnallocatedProject &&
        (item.cost?.networkUnattributedDistributed?.value > 0 ||
          item.cost?.platformDistributed?.value > 0 ||
          item.cost?.storageUnattributedDistributed?.value > 0 ||
          item.cost?.workerUnallocatedDistributed?.value > 0);
      const desc = item?.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
      const isDisabled = label === `${noPrefix}${groupBy}`;
      const isLinkDisabled = isDisabled || isUnallocatedProject || isUnattributedCosts;
      const actions = this.getActions(item, index, isDisabled);

      const name = isLinkDisabled ? (
        (label as any)
      ) : (
        <Link
          to={getBreakdownPath({
            basePath,
            description: item.id,
            id: item.id,
            isPlatformCosts,
            groupBy,
            title: label.toString(), // Convert IDs if applicable
          })}
          state={{
            ...(router.location.state && router.location.state),
            details: {
              ...(query && query),
              breadcrumbPath,
            },
          }}
        >
          {label}
        </Link>
      );

      rows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: (
              <>
                {name}
                {desc}
              </>
            ),
          },
          {
            hidden: !isGroupByProject,
            value: isDefaultProject ? (
              <Label variant="outline" color="green">
                {intl.formatMessage(messages.default)}
              </Label>
            ) : isOverheadCosts ? (
              <Tooltip
                content={intl.formatMessage(messages.overheadDesc, {
                  value: (
                    <ul style={{ listStyle: 'inside', textAlign: 'left' }}>
                      {item.cost?.networkUnattributedDistributed?.value > 0 && (
                        <li style={styles.infoTitle}>{intl.formatMessage(messages.networkUnattributedDistributed)}</li>
                      )}
                      {item.cost?.platformDistributed?.value > 0 && (
                        <li style={styles.infoTitle}>{intl.formatMessage(messages.platformDistributed)}</li>
                      )}
                      {item.cost?.storageUnattributedDistributed?.value > 0 && (
                        <li style={styles.infoTitle}>{intl.formatMessage(messages.storageUnattributedDistributed)}</li>
                      )}
                      {item.cost?.workerUnallocated?.value > 0 && (
                        <li style={styles.infoTitle}>{intl.formatMessage(messages.workerUnallocated)}</li>
                      )}
                    </ul>
                  ),
                })}
                enableFlip
              >
                <Label variant="outline" color="orange">
                  {intl.formatMessage(messages.overhead)}
                </Label>
              </Tooltip>
            ) : (
              <span style={styles.defaultLabel} />
            ),
          },
          {
            hidden: !isGroupByProject,
            value: !isPlatformCosts && !isDisabled && (
              <AsyncComponent
                scope="costManagementRos"
                module="./OptimizationsLink"
                cluster={query?.filter_by?.cluster ? query.filter_by.cluster : undefined}
                linkPath={getBreakdownPath({
                  basePath,
                  description: item.id,
                  id: item.id,
                  isPlatformCosts,
                  groupBy,
                  isOptimizationsTab: true,
                  title: label.toString(), // Convert IDs if applicable
                })}
                linkState={{
                  ...(router.location.state && router.location.state),
                  details: {
                    ...(query && query),
                    breadcrumbPath,
                  },
                }}
                project={item.id}
              />
            ),
          },
          { value: monthOverMonth, id: EfficiencyTableColumnIds.monthOverMonth },
          {
            value: InfrastructureCost,
            id: EfficiencyTableColumnIds.infrastructure,
            style: styles.managedColumn,
          },
          {
            value: supplementaryCost,
            id: EfficiencyTableColumnIds.supplementary,
            style: styles.managedColumn,
          },
          { value: cost, style: styles.managedColumn },
          { value: actions },
        ],
        item,
        selectionDisabled: isDisabled,
      });
    });

    this.setState({
      columns,
      rows,
    });
  };

  private getActions = (item: ComputedReportItem, index: number, isDisabled: boolean) => {
    const { groupBy, reportQueryString, timeScopeValue } = this.props;

    return (
      <Actions
        groupBy={groupBy}
        isDisabled={isDisabled}
        isTimeScoped
        item={item}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        reportType={ReportType.cost}
        showPriceListOption={groupBy === 'cluster'}
        showRedirectNotification={index === 0}
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getSupplementaryCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;

    const reportItemValue = ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.supplementary?.total?.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.supplementary?.total?.value, item.supplementary?.total?.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  private getInfrastructureCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;

    const reportItemValue = ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.infrastructure?.total?.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.infrastructure?.total?.value, item.infrastructure?.total?.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { intl, timeScopeValue } = this.props;

    const reportItemValue = ComputedReportItemValueType.total;
    const value = formatCurrency(
      Math.abs(item.cost[reportItemValue]?.value - item.delta_value),
      item.cost[reportItemValue]?.units
    );
    const percentage = item.delta_percent !== null ? formatPercentage(Math.abs(item.delta_percent)) : 0;

    const showPercentage = !(percentage === 0 || percentage === '0.00');
    const showValue = item.delta_percent !== null; // Workaround for https://github.com/project-koku/koku/issues/1395

    let iconOverride;
    if (showPercentage) {
      iconOverride = 'iconOverride';
      if (item.delta_percent !== null && item.delta_value < 0) {
        iconOverride += ' decrease';
      }
      if (item.delta_percent !== null && item.delta_value > 0) {
        iconOverride += ' increase';
      }
    }

    if (!showValue) {
      return getNoDataForDateRangeString(
        undefined,
        timeScopeValue === -2 ? 2 : 1,
        timeScopeValue === -2 ? true : false
      );
    } else {
      return (
        <div className="monthOverMonthOverride">
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {showPercentage ? intl.formatMessage(messages.percent, { value: percentage }) : <EmptyValueState />}
            {showPercentage && item.delta_percent !== null && item.delta_value > 0 && (
              <span className="fa fa-sort-up" style={styles.infoArrow} key={`month-over-month-icon-${index}`} />
            )}
            {showPercentage && item.delta_percent !== null && item.delta_value < 0 && (
              <span
                className="fa fa-sort-down"
                style={{ ...styles.ininfoArrow, ...styles.infoArrowDesc }}
                key={`month-over-month-icon-${index}`}
              />
            )}
          </div>
          <div style={styles.infoDescription} key={`month-over-month-info-${index}`}>
            {getForDateRangeString(
              value,
              undefined,
              timeScopeValue === -2 ? 2 : 1,
              timeScopeValue === -2 ? true : false
            )}
          </div>
        </div>
      );
    }
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;

    const reportItemValue = ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost[reportItemValue]?.value / cost) * 100)?.toFixed(2);
    return (
      <>
        {formatCurrency(item.cost[reportItemValue]?.value, item.cost[reportItemValue]?.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  public render() {
    const { exclude, filterBy, isLoading, onSelect, onSort, orderBy } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        exclude={exclude}
        filterBy={filterBy}
        isActionsCell
        isLoading={isLoading}
        isSelectable
        onSelect={onSelect}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
      />
    );
  }
}

const EfficiencyTable = injectIntl(withRouter(EfficiencyTableBase));

export { EfficiencyTable };
export type { EfficiencyTableProps };
