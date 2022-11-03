import './detailsTable.scss';

import { ProviderType } from 'api/providers';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery } from 'api/queries/ocpQuery';
import { tagPrefix } from 'api/queries/query';
import type { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { paths } from 'routes';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { Actions } from 'routes/views/details/components/actions';
import { DataTable } from 'routes/views/details/components/dataTable';
import { getBreakdownPath } from 'routes/views/utils/paths';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dates';
import { formatCurrency, formatPercentage } from 'utils/format';

import { styles } from './detailsTable.styles';

interface DetailsTableOwnProps {
  groupBy: string;
  hiddenColumns: Set<string>;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  query: OcpQuery;
  report: OcpReport;
  selectedItems?: ComputedReportItem[];
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WrappedComponentProps;

export const DetailsTableColumnIds = {
  infrastructure: 'infrastructure',
  monthOverMonth: 'monthOverMonth',
  supplementary: 'supplementary',
};

const reportPathsType = ReportPathsType.ocp;

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { hiddenColumns, query, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems ||
      prevProps.hiddenColumns !== hiddenColumns
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { hiddenColumns, isAllSelected, query, report, selectedItems, intl } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });

    const columns = groupByTagKey
      ? [
          // Sorting with tag keys is not supported
          {
            name: '',
          },
          {
            name: intl.formatMessage(messages.tagNames),
          },
          {
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            name: intl.formatMessage(messages.ocpDetailsInfrastructureCost),
            style: styles.costColumn,
          },
          {
            id: DetailsTableColumnIds.supplementary,
            name: intl.formatMessage(messages.ocpDetailsSupplementaryCost),
            style: styles.costColumn,
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
            orderBy: groupById,
            name: intl.formatMessage(messages.detailsResourceNames, { value: groupById }),
            ...(computedItems.length && { isSortable: true }),
          },
          {
            id: DetailsTableColumnIds.monthOverMonth,
            name: intl.formatMessage(messages.monthOverMonthChange),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            orderBy: 'infrastructure_cost',
            name: intl.formatMessage(messages.ocpDetailsInfrastructureCost),
            style: styles.costColumn,

            // Sort by infrastructure_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // ...(computedItems.length && { isSortable: true }),
          },
          {
            id: DetailsTableColumnIds.supplementary,
            orderBy: 'supplementary_cost',
            name: intl.formatMessage(messages.ocpDetailsSupplementaryCost),
            style: styles.costColumn,

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
      const label = item && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const InfrastructureCost = this.getInfrastructureCost(item, index);
      const supplementaryCost = this.getSupplementaryCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item);

      let name = (
        <Link
          to={getBreakdownPath({
            basePath: paths.ocpDetailsBreakdown,
            label: label.toString(),
            description: item.id,
            groupBy: groupByTagKey ? `${tagPrefix}${groupByTagKey}` : groupById,
            query,
          })}
        >
          {label}
        </Link>
      );

      const selectable = !(label === `no-${groupById}` || label === `no-${groupByTagKey}`);
      if (!selectable) {
        name = label as any;
      }

      const desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;

      rows.push({
        cells: [
          {}, // Empty cell for row selection
          {
            value: (
              <div>
                {name}
                {desc}
              </div>
            ),
          },
          { value: <div>{monthOverMonth}</div>, id: DetailsTableColumnIds.monthOverMonth },
          { value: <div>{InfrastructureCost}</div>, id: DetailsTableColumnIds.infrastructure },
          { value: <div>{supplementaryCost}</div>, id: DetailsTableColumnIds.supplementary },
          { value: <div>{cost}</div> },
          { value: <div>{actions}</div> },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
        selectionDisabled: !selectable,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !hiddenColumns.has(column.id));
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !hiddenColumns.has(cell.id));
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  private getActions = (item: ComputedReportItem) => {
    const { groupBy, query } = this.props;

    return (
      <Actions
        groupBy={groupBy}
        item={item}
        providerType={ProviderType.ocp}
        query={query}
        reportPathsType={reportPathsType}
        showPriceListOption={groupBy === 'cluster'}
      />
    );
  };

  private getSupplementaryCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
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

  private getGroupByTagKey = () => {
    const { query } = this.props;
    let groupByTagKey;

    for (const groupBy of Object.keys(query.group_by)) {
      const tagIndex = groupBy.indexOf(tagPrefix);
      if (tagIndex !== -1) {
        groupByTagKey = groupBy.substring(tagIndex + tagPrefix.length) as any;
        break;
      }
    }
    return groupByTagKey;
  };

  private getInfrastructureCost = (item: ComputedReportItem, index: number) => {
    const { report, intl } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
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
    const { intl } = this.props;
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
      return getNoDataForDateRangeString();
    } else {
      return (
        <div className="monthOverMonthOverride">
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {showPercentage ? intl.formatMessage(messages.percent, { value: percentage }) : <EmptyValueState />}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value > 0) && (
              <span className="fa fa-sort-up" style={styles.infoArrow} key={`month-over-month-icon-${index}`} />
            )}
            {Boolean(showPercentage && item.delta_percent !== null && item.delta_value < 0) && (
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
    const { report, intl } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
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
    const { groupBy, hiddenColumns, isLoading, onSelected, onSort, query, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        groupBy={groupBy}
        hiddenColumns={hiddenColumns}
        isLoading={isLoading}
        onSelected={onSelected}
        onSort={onSort}
        query={query}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const DetailsTable = injectIntl(DetailsTableBase);

export { DetailsTable };
export type { DetailsTableProps };
