import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { CalculatorIcon } from '@patternfly/react-icons/dist/js/icons/calculator-icon';
import {
  sortable,
  SortByDirection,
  Table,
  TableBody,
  TableHeader,
} from '@patternfly/react-table';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { getQueryRoute } from 'api/queries/azureQuery';
import {
  orgUnitDescriptionKey,
  orgUnitIdKey,
  orgUnitNameKey,
  tagPrefix,
} from 'api/queries/query';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType } from 'api/reports/report';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { Actions } from 'pages/details/components/actions/actions';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedAwsReportItems';
import {
  ComputedReportItem,
  getUnsortedComputedReportItems,
} from 'utils/computedReport/getComputedReportItems';
import {
  getForDateRangeString,
  getNoDataForDateRangeString,
} from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';
import {
  monthOverMonthOverride,
  styles,
  tableOverride,
} from './detailsTable.styles';

interface DetailsTableOwnProps {
  groupBy: string;
  onSelected(selectedItems: ComputedReportItem[]);
  onSort(value: string, isSortAscending: boolean);
  query: AwsQuery;
  report: AwsReport;
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps & InjectedTranslateProps;

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
    const { query, report } = this.props;
    const currentReport =
      report && report.data ? JSON.stringify(report.data) : '';
    const previousReport =
      prevProps.report && prevProps.report.data
        ? JSON.stringify(prevProps.report.data)
        : '';

    if (
      getQuery(prevProps.query) !== getQuery(query) ||
      previousReport !== currentReport
    ) {
      this.initDatum();
    }
  }

  private buildCostLink = ({
    label,
    groupByOrg,
    orgUnitDescription,
    orgUnitId,
    orgUnitName,
  }: {
    label?: string; // group_by[account]=<label> param in the breakdown page
    groupByOrg: string | number; // Used for group_by[org_unit_id]=<groupByOrg> param in the breakdown page
    orgUnitDescription: string | number; // Used to display a description in the breakdown header
    orgUnitId: string | number; // Used to navigate back to details page
    orgUnitName: string | number; // Used to display a title in the breakdown header
  }) => {
    const { groupBy, query } = this.props;

    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        ...(groupByOrg && ({ [orgUnitIdKey]: groupByOrg } as any)),
        ...(label && label !== null && { [groupBy]: label }),
      },
      ...(groupByOrg &&
        orgUnitDescription && { [orgUnitDescriptionKey]: orgUnitDescription }),
      ...(groupByOrg && orgUnitId && { [orgUnitIdKey]: orgUnitId }),
      ...(groupByOrg && orgUnitName && { [orgUnitNameKey]: orgUnitName }),
    };
    return `/details/aws/breakdown?${getQueryRoute(newQuery)}`;
  };

  private initDatum = () => {
    const { query, report, t } = this.props;
    if (!query || !report) {
      return;
    }

    const groupById = this.getGroupById();
    const groupByTagKey = this.getGroupByTagKey();
    const groupByOrg = this.getGroupByOrg();

    const total = formatCurrency(
      report &&
        report.meta &&
        report.meta.total &&
        report.meta.total.cost &&
        report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0
    );

    const columns = groupByOrg
      ? [
          {
            title: t('aws_details.names_column_title'),
          },
          {
            title: t('aws_details.change_column_title'),
          },
          {
            title: t('aws_details.cost_column_title'),
          },
          {
            title: '',
          },
        ]
      : groupByTagKey
      ? [
          {
            title: t('ocp_details.tag_column_title'),
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

    report.data.map(data => {
      if (data.sub_orgs) {
        data.sub_orgs.map((item, index) => {
          const value = item.values ? item.values[0] : [];
          const reportItem: ComputedReportItem = {
            cost: value.cost && value.cost.total ? value.cost.total.value : 0,
            deltaPercent: value.delta_percent ? value.delta_percent : 0,
            deltaValue: value.deltaValue ? value.deltaValue : 0,
            id: item.org_unit_id || '',
            label: item.org_unit_name || '',
            source_uuid: value.source_uuid,
            units: {
              cost:
                value.cost && value.cost.total ? value.cost.total.units : 'USD',
            },
          };
          const monthOverMonth = this.getMonthOverMonthCost(reportItem, index);
          const cost = this.getTotalCost(reportItem, index);
          const actions = this.getActions(reportItem, index);
          const name = (
            <Link
              to={this.buildCostLink({
                // label: '*', // This results in group_by[account]=*, but can skip that for sub-orgs
                groupByOrg: groupByOrg ? reportItem.id : undefined,
                orgUnitDescription: reportItem.id,
                orgUnitId: this.getGroupByOrg(),
                orgUnitName: reportItem.label,
              })}
            >
              {reportItem.label}
            </Link>
          );
          const id = <div style={styles.infoDescription}>{reportItem.id}</div>;

          rows.push({
            cells: [
              {
                title: (
                  <div>
                    {name}
                    {id}
                  </div>
                ),
              },
              { title: <div>{monthOverMonth}</div> },
              { title: <div>{cost}</div> },
              { title: <div>{actions}</div> },
            ],
            isOpen: false,
            item,
          });
        });
      }
    });

    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });

    computedItems.map((item, index) => {
      const label = item && item.label && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const cost = this.getTotalCost(item, index);
      const actions = this.getActions(item, index);

      let name = (
        <Link
          to={this.buildCostLink({
            label: label.toString(),
            groupByOrg,
            orgUnitDescription: item.id,
            orgUnitId: this.getGroupByOrg(),
            orgUnitName: item.label,
          })}
        >
          {label}
        </Link>
      );
      if (label === `no-${groupById}` || label === `no-${groupByTagKey}`) {
        name = label as any;
      }

      const id = groupByOrg ? (
        <div style={styles.infoDescription}>{item.id}</div>
      ) : null;

      rows.push({
        cells: [
          {
            title: (
              <div>
                {name}
                {id}
              </div>
            ),
          },
          { title: <div>{monthOverMonth}</div> },
          { title: <div>{cost}</div> },
          { title: <div>{actions}</div> },
        ],
        isOpen: false,
        item,
      });
    });

    this.setState({
      columns,
      rows,
      sortBy: {},
    });
  };

  private getActions = (item: ComputedReportItem, index: number) => {
    const { groupBy, query } = this.props;

    return (
      <Actions
        groupBy={groupBy}
        item={item}
        query={query}
        reportPathsType={reportPathsType}
      />
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

  private getGroupById = () => {
    const { query } = this.props;

    let groupById: string = getIdKeyForGroupBy(query.group_by);
    const groupByTagKey = this.getGroupByTagKey();

    if (this.getGroupByOrg()) {
      groupById = 'account';
    } else if (groupByTagKey) {
      groupById = `${tagPrefix}${groupByTagKey}`;
    }
    return groupById;
  };

  private getGroupByOrg = () => {
    const { query } = this.props;
    let groupByOrg;

    for (const groupBy of Object.keys(query.group_by)) {
      const index = groupBy.indexOf(orgUnitIdKey);
      if (index !== -1) {
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
    const value = formatCurrency(Math.abs(item.cost - item.deltaValue));
    const percentage =
      item.deltaPercent !== null ? Math.abs(item.deltaPercent).toFixed(2) : 0;

    const showPercentage = !(percentage === 0 || percentage === '0.00');
    const showValue = item.deltaPercent !== null; // Workaround for https://github.com/project-koku/koku/issues/1395

    let iconOverride;
    if (showPercentage) {
      iconOverride = 'iconOverride';
      if (item.deltaPercent !== null && item.deltaValue < 0) {
        iconOverride += ' decrease';
      }
      if (item.deltaPercent !== null && item.deltaValue > 0) {
        iconOverride += ' increase';
      }
    }

    if (!showValue) {
      return getNoDataForDateRangeString();
    } else {
      return (
        <div className={monthOverMonthOverride}>
          <div className={iconOverride} key={`month-over-month-cost-${index}`}>
            {Boolean(showPercentage) ? (
              t('percent', { value: percentage })
            ) : (
              <EmptyValueState />
            )}
            {Boolean(
              showPercentage &&
                item.deltaPercent !== null &&
                item.deltaValue > 0
            ) && (
              <span
                className="fa fa-sort-up"
                style={styles.infoArrow}
                key={`month-over-month-icon-${index}`}
              />
            )}
            {Boolean(
              showPercentage &&
                item.deltaPercent !== null &&
                item.deltaValue < 0
            ) && (
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
          <div
            style={styles.infoDescription}
            key={`month-over-month-info-${index}`}
          >
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
          direction =
            query.order_by[key] === 'asc'
              ? SortByDirection.asc
              : SortByDirection.desc;
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
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total
        ? report.meta.total.cost.total.value
        : 0;

    return (
      <>
        {formatCurrency(item.cost)}
        <div style={styles.infoDescription} key={`total-cost-${index}`}>
          {t('percent_of_cost', {
            value: ((item.cost / cost) * 100).toFixed(2),
          })}
        </div>
      </>
    );
  };

  private handleOnSelect = (event, isSelected, rowId) => {
    const { onSelected } = this.props;

    let rows;
    if (rowId === -1) {
      rows = this.state.rows.map(row => {
        row.selected = isSelected;
        return row;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
    }

    if (onSelected) {
      const selectedItems = [];
      for (const row of rows) {
        if (row.selected && row.item && !row.parent) {
          selectedItems.push(row.item);
        }
      }
      onSelected(selectedItems);
    }
    this.setState({ rows });
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
    const { columns, rows } = this.state;

    return (
      <>
        <Table
          aria-label="details-table"
          cells={columns}
          className={tableOverride}
          rows={rows}
          sortBy={this.getSortBy()}
          onSelect={this.handleOnSelect}
          onSort={this.handleOnSort}
          gridBreakPoint="grid-2xl"
        >
          <TableHeader />
          <TableBody />
        </Table>
        {Boolean(rows.length === 0) && (
          <div style={styles.emptyState}>{this.getEmptyState()}</div>
        )}
      </>
    );
  }
}

const DetailsTable = translate()(DetailsTableBase);

export { DetailsTable, DetailsTableProps };
