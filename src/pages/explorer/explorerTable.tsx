import './explorerTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/js/icons/calculator-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { orgUnitIdKey, tagPrefix } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './explorerTable.styles';

interface ExplorerTableOwnProps {
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  query: AwsQuery;
  report: AwsReport;
  selectedItems?: ComputedReportItem[];
}

interface ExplorerTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type ExplorerTableProps = ExplorerTableOwnProps & WithTranslation;

class ExplorerTableBase extends React.Component<ExplorerTableProps> {
  public state: ExplorerTableState = {
    columns: [],
    rows: [],
  };

  constructor(props: ExplorerTableProps) {
    super(props);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnSort = this.handleOnSort.bind(this);
  }

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: ExplorerTableProps) {
    const { query, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { isAllSelected, query, report, selectedItems, t } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = this.getGroupByOrg();
    const groupByTagKey = this.getGroupByTagKey();

    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              title: groupByOrg ? t('explorer.name_column_title') : t('explorer.tag_column_title'),
            },
            {
              title: t('explorer.daily_column_title'),
            },
            // Todo: add columns for daily data
          ]
        : [
            {
              orderBy: groupById === 'account' ? 'account_alias' : groupById,
              title: t('explorer.name_column_title', { groupBy: groupById }),
              transforms: [sortable],
            },
            {
              title: t('explorer.daily_column_title'),
            },
            // Todo: add columns for daily data
          ];

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label && item.label !== null ? item.label : '';
      const cost = this.getTotalCost(item, index);

      // Todo: Fix missing id -- see https://issues.redhat.com/browse/COST-955
      const id = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;

      rows.push({
        cells: [
          {
            title: (
              <div>
                {label}
                {id}
              </div>
            ),
          },
          { title: <div>{cost}</div> },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
      });
    });

    const loadingRows = [
      {
        heightAuto: true,
        cells: [
          {
            props: { colSpan: 5 },
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

    this.setState({
      columns,
      loadingRows,
      rows,
      sortBy: {},
    });
  };

  private getEmptyState = () => {
    const { query, t } = this.props;

    for (const val of Object.values(query.filter_by)) {
      if (val !== '*') {
        return <EmptyFilterState filter={val} showMargin={false} />;
      }
    }
    return (
      <EmptyState>
        <EmptyStateIcon icon={CalculatorIcon} />
        <EmptyStateBody>{t('explorer.empty_state')}</EmptyStateBody>
      </EmptyState>
    );
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      if (groupBy === orgUnitIdKey) {
        groupByOrg = query.group_by[orgUnitIdKey];
        break;
      }
    }
    return groupByOrg;
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

  public getSortBy = () => {
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
          aria-label="explorer-table"
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

const ExplorerTable = withTranslation()(ExplorerTableBase);

export { ExplorerTable, ExplorerTableProps };
