import './detailsTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/esm/icons/calculator-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { ProviderType } from 'api/providers';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { tagPrefix } from 'api/queries/query';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { Actions } from 'pages/views/details/components/actions/actions';
import { getBreakdownPath } from 'pages/views/utils/paths';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { paths } from 'routes';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';

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
  loadingRows?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WithTranslation;

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

  constructor(props: DetailsTableProps) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

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
    const { hiddenColumns, isAllSelected, query, report, selectedItems, t } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    const total = formatCurrency(
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0
    );

    const columns = groupByTagKey
      ? [
          // Sorting with tag keys is not supported
          {
            title: t('details.tag_names'),
          },
          {
            id: DetailsTableColumnIds.monthOverMonth,
            title: t('details.month_over_month_change'),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            title: t('ocp_details.infrastructure_cost'),
          },
          {
            id: DetailsTableColumnIds.supplementary,
            title: t('ocp_details.supplementary_cost'),
          },
          {
            orderBy: 'cost',
            title: t('cost', { total }),
            transforms: [sortable],
          },
          {
            title: '',
          },
        ]
      : [
          {
            orderBy: groupById,
            title: t('details.resource_names', { groupBy: groupById }),
            transforms: [sortable],
          },
          {
            id: DetailsTableColumnIds.monthOverMonth,
            title: t('details.month_over_month_change'),
          },
          {
            id: DetailsTableColumnIds.infrastructure,
            orderBy: 'infrastructure_cost',
            title: t('ocp_details.infrastructure_cost'),

            // Sort by infrastructure_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // transforms: [sortable],
          },
          {
            id: DetailsTableColumnIds.supplementary,
            orderBy: 'supplementary_cost',
            title: t('ocp_details.supplementary_cost'),

            // Sort by supplementary_cost is not supported -- https://github.com/project-koku/koku/issues/796
            // transforms: [sortable],
          },
          {
            orderBy: 'cost',
            title: t('cost'),
            transforms: [sortable],
          },
          {
            title: '',
          },
        ];

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });

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
          {
            title: (
              <div>
                {name}
                {desc}
              </div>
            ),
          },
          { title: <div>{monthOverMonth}</div>, id: DetailsTableColumnIds.monthOverMonth },
          { title: <div>{InfrastructureCost}</div>, id: DetailsTableColumnIds.infrastructure },
          { title: <div>{supplementaryCost}</div>, id: DetailsTableColumnIds.supplementary },
          { title: <div>{cost}</div> },
          { title: <div>{actions}</div> },
        ],
        disableSelection: !selectable,
        isOpen: false,
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
      });
    });

    const loadingRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 7 },
            title: (
              <Bullseye>
                <div style={{ textAlign: 'center' }}>
                  <Spinner size="xl" />
                </div>
              </Bullseye>
            ),
          },
        ],
      },
    ];

    const filteredColumns = columns.filter(column => !hiddenColumns.has(column.id));
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !hiddenColumns.has(cell.id));
      return row;
    });

    this.setState({
      columns: filteredColumns,
      loadingRows,
      rows: filteredRows,
      sortBy: {},
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

  private getEmptyState = () => {
    const { query, t } = this.props;

    for (const val of Object.values(query.filter_by)) {
      if (val !== '*') {
        return <EmptyFilterState filter={val as string} showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{t('details.empty_state')}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getSupplementaryCost = (item: ComputedReportItem, index: number) => {
    const { report, t } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.supplementary.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.supplementary.total.value)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {t('percent_of_cost', {
            value: percentValue,
          })}
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
    const { report, t } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.infrastructure.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.infrastructure.total.value)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {t('percent_of_cost', {
            value: percentValue,
          })}
        </div>
      </>
    );
  };

  private getMonthOverMonthCost = (item: ComputedReportItem, index: number) => {
    const { t } = this.props;
    const value = formatCurrency(Math.abs(item.cost.total.value - item.delta_value));
    const percentage = item.delta_percent !== null ? Math.abs(item.delta_percent).toFixed(2) : 0;

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
            {showPercentage ? t('percent', { value: percentage }) : <EmptyValueState />}
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

  private getSortBy = () => {
    const { query } = this.props;
    const { columns } = this.state;

    let index = -1;
    let direction: any = SortByDirection.asc;

    for (const key of Object.keys(query.order_by)) {
      let c = 0;
      for (const column of columns) {
        if (column.orderBy === key) {
          direction = query.order_by[key] === 'asc' ? SortByDirection.asc : SortByDirection.desc;
          index = c + 1;
          break;
        }
        c++;
      }
    }
    return index > -1 ? { index, direction } : {};
  };

  private getTotalCost = (item: ComputedReportItem, index: number) => {
    const { report, t } = this.props;
    const cost =
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;
    const percentValue = cost === 0 ? cost.toFixed(2) : ((item.cost.total.value / cost) * 100).toFixed(2);
    return (
      <>
        {formatCurrency(item.cost.total.value)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {t('percent_of_cost', {
            value: percentValue,
          })}
        </div>
      </>
    );
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;

    let rows;
    let items = [];
    if (rowId === -1) {
      rows = this.state.rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
      items = [rows[rowId].item];
    }
    this.setState({ rows }, () => {
      if (onSelected) {
        onSelected(items, isSelected);
      }
    });
  };

  private handleOnSort = (event, index, direction) => {
    const { onSort } = this.props;
    const { columns } = this.state;

    if (onSort) {
      const orderBy = columns[index - 1].orderBy;
      const isSortAscending = direction === SortByDirection.asc;
      onSort(orderBy, isSortAscending);
    }
  };

  public render() {
    const { isLoading } = this.props;
    const { columns, loadingRows, rows } = this.state;

    return (
      <>
        <Table
          aria-label="details-table"
          canSelectAll={false}
          cells={columns}
          className="tableOverride"
          rows={isLoading ? loadingRows : rows}
          sortBy={this.getSortBy()}
          onSelect={isLoading ? undefined : this.handleOnSelect}
          onSort={this.handleOnSort}
          gridBreakPoint="grid-2xl"
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && <div style={styles.emptyState}>{this.getEmptyState()}</div>}
      </>
    );
  }
}

const DetailsTable = withTranslation()(DetailsTableBase);

export { DetailsTable, DetailsTableProps };
