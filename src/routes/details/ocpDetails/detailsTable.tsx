import 'routes/components/dataTable/dataTable.scss';

import { Label, Tooltip } from '@patternfly/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { ProviderType } from 'api/providers';
import type { Query } from 'api/queries/query';
import type { OcpReport, OcpReportItem } from 'api/reports/ocpReports';
import { ReportPathsType } from 'api/reports/report';
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
import { classificationDefault, classificationPlatform, classificationUnallocated, noPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface DetailsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  basePath?: string;
  breadcrumbPath?: string;
  costDistribution?: string;
  filterBy?: any;
  groupBy: string;
  groupByTagKey: string;
  hiddenColumns?: Set<string>;
  isAllSelected?: boolean;
  isLoading?: boolean;
  isRosFeatureEnabled?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: OcpReport;
  reportQueryString: string;
  selectedItems?: ComputedReportItem[];
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps;

export const DetailsTableColumnIds = {
  infrastructure: 'infrastructure',
  monthOverMonth: 'monthOverMonth',
  supplementary: 'supplementary',
};

const reportPathsType = ReportPathsType.ocp;

class DetailsTableBase extends React.Component<DetailsTableProps, DetailsTableState> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { costDistribution, hiddenColumns, report, selectedItems } = this.props;
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      previousReport !== currentReport ||
      prevProps.costDistribution !== costDistribution ||
      prevProps.selectedItems !== selectedItems ||
      prevProps.hiddenColumns !== hiddenColumns
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const {
      basePath,
      breadcrumbPath,
      costDistribution,
      groupBy,
      groupByTagKey,
      hiddenColumns,
      intl,
      isAllSelected,
      isRosFeatureEnabled,
      query,
      report,
      router,
      selectedItems,
    } = this.props;
    if (!report) {
      return;
    }

    const isGroupByProject = groupBy === 'project';

    const rows = [];
    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: (groupByTagKey ? groupByTagKey : groupBy) as any,
    });

    const columns = groupByTagKey
      ? [
          // Sorting with tag keys is not supported
          {
            name: '',
          },
          {
            name: intl.formatMessage(messages.tagNames),
            style: groupBy === 'project' ? styles.nameColumn : undefined,
          },
          {
            hidden: !isGroupByProject,
            name: '', // Default & Overhead column
          },
          {
            hidden: !(isGroupByProject && isRosFeatureEnabled),
            name: intl.formatMessage(messages.optimizations),
          },
          {
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            name: intl.formatMessage(messages.ocpDetailsInfrastructureCost),
            style: styles.managedColumn,
          },
          {
            id: DetailsTableColumnIds.supplementary,
            name: intl.formatMessage(messages.ocpDetailsSupplementaryCost),
            style: styles.managedColumn,
          },
          {
            orderBy: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
            name: intl.formatMessage(messages.cost),
            style: styles.costColumn,
            ...(computedItems.length && { isSortable: false }),
          },
          {
            name: '',
          },
        ]
      : [
          {
            name: '',
          },
          {
            orderBy: groupBy,
            name: intl.formatMessage(messages.detailsResourceNames, { value: groupBy }),
            ...(computedItems.length && { isSortable: true }),
            style: groupBy === 'project' ? styles.nameColumn : undefined,
          },
          {
            hidden: !isGroupByProject,
            name: '', // Default & Overhead column
          },
          {
            hidden: !(isGroupByProject && isRosFeatureEnabled),
            name: intl.formatMessage(messages.optimizations),
          },
          {
            id: DetailsTableColumnIds.monthOverMonth,
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            orderBy: 'infrastructure_cost',
            name: intl.formatMessage(messages.ocpDetailsInfrastructureCost),
            style: styles.managedColumn,

            // Sort by infrastructure_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // ...(computedItems.length && { isSortable: true }),
          },
          {
            id: DetailsTableColumnIds.supplementary,
            orderBy: 'supplementary_cost',
            name: intl.formatMessage(messages.ocpDetailsSupplementaryCost),
            style: styles.managedColumn,

            // Sort by supplementary_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // ...(computedItems.length && { isSortable: true }),
          },
          {
            orderBy: costDistribution === ComputedReportItemValueType.distributed ? 'distributed_cost' : 'cost',
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
      const label = item && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const supplementaryCost = this.getSupplementaryCost(item, index);
      const InfrastructureCost = this.getInfrastructureCost(item, index);
      const isPlatformCosts = item.classification === classificationPlatform;
      const isUnallocatedCosts = item.classification === classificationUnallocated;
      const isOverheadCosts =
        costDistribution === ComputedReportItemValueType.distributed &&
        !isUnallocatedCosts &&
        ((item.cost.platformDistributed && item.cost.platformDistributed.value > 0) ||
          (item.cost.workerUnallocatedDistributed && item.cost.workerUnallocatedDistributed.value > 0));
      const desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
      const isDisabled =
        label === `${noPrefix}${groupBy}` || label === `${noPrefix}${groupByTagKey}` || isUnallocatedCosts;
      const actions = this.getActions(item, isDisabled);

      const name = isDisabled ? (
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
                <div>{name}</div>
                <div style={styles.infoDescription}>{desc}</div>
              </>
            ),
          },
          {
            hidden: !isGroupByProject,
            value:
              item.classification === classificationDefault ? (
                <Label variant="outline" color="green">
                  {intl.formatMessage(messages.default)}
                </Label>
              ) : isOverheadCosts ? (
                <Tooltip content={intl.formatMessage(messages.overheadDesc)} enableFlip>
                  <Label variant="outline" color="orange">
                    {intl.formatMessage(messages.overhead)}
                  </Label>
                </Tooltip>
              ) : (
                <span style={styles.defaultLabel} />
              ),
          },
          {
            hidden: !(isGroupByProject && isRosFeatureEnabled),
            value: !isPlatformCosts && !isDisabled && (
              <AsyncComponent
                scope="costManagementMfe"
                appName="cost-management-mfe"
                module="./MfeOptimizationsLink"
                groupBy={groupBy}
                groupByValue={item.id}
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
              />
            ),
          },
          { value: monthOverMonth, id: DetailsTableColumnIds.monthOverMonth },
          {
            value: InfrastructureCost,
            id: DetailsTableColumnIds.infrastructure,
            style: styles.managedColumn,
          },
          {
            value: supplementaryCost,
            id: DetailsTableColumnIds.supplementary,
            style: styles.managedColumn,
          },
          { value: cost, style: styles.managedColumn },
          { value: actions },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
        selectionDisabled: isDisabled,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !hiddenColumns.has(column.id) && !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !hiddenColumns.has(cell.id) && !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  private getActions = (item: ComputedReportItem, isDisabled) => {
    const { groupBy, reportQueryString } = this.props;

    return (
      <Actions
        groupBy={groupBy}
        isDisabled={isDisabled}
        item={item}
        providerType={ProviderType.ocp}
        reportPathsType={reportPathsType}
        reportQueryString={reportQueryString}
        showPriceListOption={groupBy === 'cluster'}
      />
    );
  };

  private getSupplementaryCost = (item: ComputedReportItem, index: number) => {
    const { costDistribution, report, intl } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.supplementary.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.supplementary.total.value, item.supplementary.total.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  private getInfrastructureCost = (item: ComputedReportItem, index: number) => {
    const { costDistribution, report, intl } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.infrastructure.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.infrastructure.total.value, item.infrastructure.total.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { costDistribution, intl } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const value = formatCurrency(
      Math.abs(item.cost[reportItemValue].value - item.delta_value),
      item.cost[reportItemValue].units
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
      return getNoDataForDateRangeString();
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
            {getForDateRangeString(value)}
          </div>
        </div>
      );
    }
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { costDistribution, report, intl } = this.props;

    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const cost =
      report?.meta?.total?.cost && report.meta.total.cost[reportItemValue]
        ? report.meta.total.cost[reportItemValue].value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost[reportItemValue].value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.cost[reportItemValue].value, item.cost[reportItemValue].units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  public render() {
    const { filterBy, isLoading, onSelect, onSort, orderBy, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        filterBy={filterBy}
        isActionsCell
        isLoading={isLoading}
        onSelect={onSelect}
        onSort={onSort}
        orderBy={orderBy}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const DetailsTable = injectIntl(withRouter(DetailsTableBase));

export { DetailsTable };
export type { DetailsTableProps };
