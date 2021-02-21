import './awsDetailsTable.scss';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Spinner } from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/js/icons/calculator-icon';
import { sortable, SortByDirection, Table, TableBody, TableHeader } from '@patternfly/react-table';
import { AwsQuery, getQuery, getQueryRoute } from 'api/queries/awsQuery';
import { breakdownDescKey, breakdownTitleKey, orgUnitIdKey, tagPrefix } from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { Actions } from 'pages/details/components/actions/actions';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { paths } from 'routes';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';

import { styles } from './detailsTable.styles';

interface DetailsTableOwnProps {
  groupBy: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
  query: AwsQuery;
  report: AwsReport;
  selectedItems?: ComputedReportItem[];
}

interface DetailsTableState {
  columns?: any[];
  loadingRows?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & WithTranslation;

const reportPathsType = ReportPathsType.aws;

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

  private buildCostLink = ({
    description,
    groupByOrg,
    id,
    orgUnitId,
    title,
    type,
  }: {
    description: string | number; // Used to display a description in the breakdown header
    groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
    id: string | number; // group_by[account]=<id> param in the breakdown page
    orgUnitId: string | number; // Used to navigate back to details page
    title: string | number; // Used to display a title in the breakdown header
    type: string; // account or organizational_unit
  }) => {
    const { groupBy, query } = this.props;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      ...(description && description !== title && { [breakdownDescKey]: description }),
      ...(title && { [breakdownTitleKey]: title }),
      ...(groupByOrg && orgUnitId && { [orgUnitIdKey]: orgUnitId }),
      group_by: {
        [groupBy]: id, // This may be overridden below
      },
    };
    if (!newQuery.filter) {
      newQuery.filter = {};
    }
    if (type === 'account') {
      newQuery.filter.account = id;
      newQuery.group_by = {
        [orgUnitIdKey]: groupByOrg,
      };
    } else if (type === 'organizational_unit') {
      newQuery.group_by = {
        [orgUnitIdKey]: id,
      };
    }
    return `${paths.awsDetailsBreakdown}?${getQueryRoute(newQuery)}`;
  };

  private initDatum = () => {
    const { isAllSelected, query, report, selectedItems, t } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = this.getGroupByOrg();
    const groupByTagKey = this.getGroupByTagKey();

    const total = formatCurrency(
      report && report.meta && report.meta.total && report.meta.total.cost && report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0
    );

    const columns =
      groupByTagKey || groupByOrg
        ? [
            {
              title: groupByOrg ? t('aws_details.org_unit_column_title') : t('aws_details.tag_column_title'),
            },
            {
              title: t('aws_details.change_column_title'),
            },
            {
              orderBy: 'cost',
              title: t('aws_details.cost_column_title', { total }),
              transforms: [sortable],
            },
            {
              title: '',
            },
          ]
        : [
            {
              orderBy: groupById === 'account' ? 'account_alias' : groupById,
              title: t('aws_details.name_column_title', { groupBy: groupById }),
              transforms: [sortable],
            },
            {
              title: t('aws_details.change_column_title'),
            },
            {
              orderBy: 'cost',
              title: t('aws_details.cost_column_title'),
              transforms: [sortable],
            },
            {
              title: '',
            },
          ];

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item, index);

      let name = (
        <Link
          to={this.buildCostLink({
            description: item.id,
            groupByOrg,
            id: item.id,
            orgUnitId: this.getGroupByOrg(),
            title: item.label,
            type: item.type,
          })}
        >
          {label}
        </Link>
      );
      if (label === `no-${groupById}` || label === `no-${groupByTagKey}`) {
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
          { title: <div>{monthOverMonth}</div> },
          { title: <div>{cost}</div> },
          { title: <div>{actions}</div> },
        ],
        disableSelection: item.label === `no-${groupById}` || item.label === `no-${groupByTagKey}`,
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

  private getActions = (item: ComputedReportItem, index: number, disabled: boolean = false) => {
    const { groupBy, query } = this.props;

    return (
      <Actions groupBy={groupBy} isDisabled={disabled} item={item} query={query} reportPathsType={reportPathsType} />
    );
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
        <EmptyStateBody>{t('aws_details.empty_state')}</EmptyStateBody>
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
                style={{
                  ...styles.infoArrow,
                  ...styles.infoArrowDesc,
                }}
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
