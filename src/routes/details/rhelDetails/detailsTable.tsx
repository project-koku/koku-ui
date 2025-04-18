import 'routes/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import type { RhelReport } from 'api/reports/rhelReports';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import { DataTable } from 'routes/components/dataTable';
import { styles } from 'routes/components/dataTable/dataTable.styles';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Actions } from 'routes/details/components/actions';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getBreakdownPath } from 'routes/utils/paths';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dates';
import { formatCurrency, formatPercentage } from 'utils/format';
import { formatPath } from 'utils/paths';
import { noPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface DetailsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  breadcrumbPath?: string;
  exclude?: any;
  filterBy?: any;
  groupBy: string;
  groupByTagKey: string;
  hiddenColumns: Set<string>;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: RhelReport;
  reportQueryString: string;
  selectedItems?: ComputedReportItem[];
  timeScopeValue?: number;
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

const reportPathsType = ReportPathsType.rhel;

class DetailsTableBase extends React.Component<DetailsTableProps, DetailsTableState> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { hiddenColumns, report, selectedItems, timeScopeValue } = this.props;
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems ||
      prevProps.hiddenColumns !== hiddenColumns ||
      timeScopeValue !== prevProps.timeScopeValue
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const {
      breadcrumbPath,
      groupBy,
      groupByTagKey,
      hiddenColumns,
      intl,
      isAllSelected,
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
    const computedItems = getUnsortedComputedReportItems({
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
            style: isGroupByProject ? styles.nameColumn : undefined,
          },
          {
            hidden: !isGroupByProject,
            name: '', // Default column
          },
          {
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            name: intl.formatMessage(messages.rhelDetailsInfrastructureCost),
            style: styles.managedColumn,
          },
          {
            id: DetailsTableColumnIds.supplementary,
            name: intl.formatMessage(messages.rhelDetailsSupplementaryCost),
            style: styles.managedColumn,
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
        ]
      : [
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
            name: '', // Default column
          },
          {
            id: DetailsTableColumnIds.monthOverMonth,
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            orderBy: 'infrastructure_cost',
            name: intl.formatMessage(messages.rhelDetailsInfrastructureCost),
            style: styles.managedColumn,

            // Sort by infrastructure_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // ...(computedItems.length && { isSortable: true }),
          },
          {
            id: DetailsTableColumnIds.supplementary,
            orderBy: 'supplementary_cost',
            name: intl.formatMessage(messages.rhelDetailsSupplementaryCost),
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
      const desc = item?.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
      const isDisabled = label === `${noPrefix}${groupBy}` || label === `${noPrefix}${groupByTagKey}`;
      const actions = this.getActions(item, isDisabled);

      const name = isDisabled ? (
        (label as any)
      ) : (
        <Link
          to={getBreakdownPath({
            basePath: formatPath(routes.rhelBreakdown.path),
            description: item.id,
            groupBy,
            id: item.id,
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
            value: item.default_project ? (
              <div>
                <Label variant="outline" color="green">
                  {intl.formatMessage(messages.default)}
                </Label>
              </div>
            ) : (
              <div style={styles.defaultLabel} />
            ),
          },
          { value: <div>{monthOverMonth}</div>, id: DetailsTableColumnIds.monthOverMonth },
          {
            value: <div>{InfrastructureCost}</div>,
            id: DetailsTableColumnIds.infrastructure,
            style: styles.managedColumn,
          },
          {
            value: <div>{supplementaryCost}</div>,
            id: DetailsTableColumnIds.supplementary,
            style: styles.managedColumn,
          },
          { value: <div>{cost}</div>, style: styles.managedColumn },
          { value: <div>{actions}</div> },
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
        timeScopeValue={timeScopeValue}
      />
    );
  };

  private getSupplementaryCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost = report?.meta?.total?.cost?.total ? report.meta.total.cost.total.value : 0;
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
    const { report, intl } = this.props;
    const cost = report?.meta?.total?.cost?.total ? report.meta.total.cost.total.value : 0;
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
    const { intl, timeScopeValue } = this.props;
    const value = formatCurrency(Math.abs(item.cost.total.value - item.delta_value), item.cost.total.units);
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
    const cost = report?.meta?.total?.cost?.total ? report.meta.total.cost.total.value : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.cost.total.value, item.cost.total.units)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {intl.formatMessage(messages.percentOfCost, { value: percentValue })}
        </div>
      </>
    );
  };

  public render() {
    const { exclude, filterBy, isLoading, onSelect, onSort, orderBy, selectedItems } = this.props;
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
        selectedItems={selectedItems}
      />
    );
  }
}

const DetailsTable = injectIntl(withRouter(DetailsTableBase));

export { DetailsTable };
export type { DetailsTableProps };
