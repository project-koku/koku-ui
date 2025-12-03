import '../../components/dataTable/dataTable.scss';

import type { Query } from '@koku-ui/api/queries/query';
import type { AwsReport } from '@koku-ui/api/reports/awsReports';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { routes } from '../../../routes';
import { getForDateRangeString, getNoDataForDateRangeString } from '../../../utils/dates';
import { formatCurrency, formatPercentage } from '../../../utils/format';
import { formatPath } from '../../../utils/paths';
import { noPrefix } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { DataTable } from '../../components/dataTable';
import { styles } from '../../components/dataTable/dataTable.styles';
import { EmptyValueState } from '../../components/state/emptyValueState';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../../utils/computedReport/getComputedReportItems';
import { getOrgBreakdownPath } from '../../utils/paths';
import { Actions } from '../components/actions';

interface DetailsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  breadcrumbPath?: string;
  exclude?: any;
  filterBy?: any;
  groupBy: string;
  groupByCostCategory?: string;
  groupByOrg?: string;
  groupByTagKey?: string;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelect(items: ComputedReportItem[], isSelected: boolean);
  onSort(sortType: string, isSortAscending: boolean);
  orderBy?: any;
  query?: Query;
  report: AwsReport;
  reportQueryString: string;
  selectedItems?: ComputedReportItem[];
  timeScopeValue?: number;
}

interface DetailsTableState {
  columns?: any[];
  rows?: any[];
}

type DetailsTableProps = DetailsTableOwnProps;

const reportPathsType = ReportPathsType.aws;

class DetailsTableBase extends React.Component<DetailsTableProps, DetailsTableState> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { report, selectedItems, timeScopeValue } = this.props;
    const currentReport = report?.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps?.report?.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems ||
      timeScopeValue !== prevProps.timeScopeValue
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const {
      breadcrumbPath,
      groupBy,
      groupByCostCategory,
      groupByOrg,
      groupByTagKey,
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

    const isGroupByAccount = groupBy === 'account';

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: (groupByCostCategory
        ? groupByCostCategory
        : groupByTagKey
          ? groupByTagKey
          : groupByOrg
            ? 'org_entities'
            : groupBy) as any,
    });

    const columns =
      groupByCostCategory || groupByTagKey || groupByOrg
        ? [
            {
              name: '',
            },
            {
              name: groupByCostCategory
                ? intl.formatMessage(messages.costCategoryNames)
                : groupByOrg
                  ? intl.formatMessage(messages.names, { count: 2 })
                  : intl.formatMessage(messages.tagNames),
            },
            {
              name: intl.formatMessage(messages.monthOverMonthChange),
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
              orderBy: isGroupByAccount ? 'account_alias' : groupBy,
              name: intl.formatMessage(messages.detailsResourceNames, { value: groupBy }),
              ...(computedItems.length && { isSortable: true }),
            },
            {
              name: intl.formatMessage(messages.monthOverMonthChange),
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
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const label = item?.label && item.label !== null ? item.label : '';
      const isDisabled =
        label === `${noPrefix}${groupBy}` ||
        label === `${noPrefix}${groupByCostCategory}` ||
        label === `${noPrefix}${groupByTagKey}`;
      const desc = item?.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
      const actions = this.getActions(item, isDisabled);

      const name = isDisabled ? (
        (label as any)
      ) : (
        <Link
          to={getOrgBreakdownPath({
            basePath: formatPath(routes.awsBreakdown.path),
            description: item.id,
            groupBy,
            groupByOrg,
            id: item.id,
            title: label.toString(), // Convert IDs if applicable
            type: item.type,
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
          { value: monthOverMonth },
          { value: cost, style: styles.managedColumn },
          { value: actions },
        ],
        item,
        selected: isAllSelected || (selectedItems && selectedItems.find(val => val.id === item.id) !== undefined),
        selectionDisabled: isDisabled,
      });
    });

    const filteredColumns = (columns as any[]).filter(column => !column.hidden);
    const filteredRows = rows.map(({ ...row }) => {
      row.cells = row.cells.filter(cell => !cell.hidden);
      return row;
    });

    this.setState({
      columns: filteredColumns,
      rows: filteredRows,
    });
  };

  private getActions = (item: ComputedReportItem, isDisabled: boolean = false) => {
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
        timeScopeValue={timeScopeValue}
      />
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
                style={{
                  ...styles.infoArrow,
                  ...styles.infoArrowDesc,
                }}
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
