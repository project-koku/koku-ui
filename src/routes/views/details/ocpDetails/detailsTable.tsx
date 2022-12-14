import 'routes/views/details/components/dataTable/dataTable.scss';

import { Label } from '@patternfly/react-core';
import { ProviderType } from 'api/providers';
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
import { styles } from 'routes/views/details/components/dataTable/dataTable.styles';
import { getBreakdownPath } from 'routes/views/utils/paths';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { getForDateRangeString, getNoDataForDateRangeString } from 'utils/dates';
import { formatCurrency, formatPercentage } from 'utils/format';
import { classificationDefault, classificationPlatform, classificationUnallocated, noPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface DetailsTableOwnProps extends RouterComponentProps, WrappedComponentProps {
  groupBy: string;
  groupByTagKey: string;
  hiddenColumns: Set<string>;
  isAllSelected?: boolean;
  isLoading?: boolean;
  onSelected(items: ComputedReportItem[], isSelected: boolean);
  onSort(value: string, isSortAscending: boolean);
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

class DetailsTableBase extends React.Component<DetailsTableProps> {
  public state: DetailsTableState = {
    columns: [],
    rows: [],
  };

  public componentDidMount() {
    this.initDatum();
  }

  public componentDidUpdate(prevProps: DetailsTableProps) {
    const { hiddenColumns, report, selectedItems } = this.props;
    const currentReport = report && report.data ? JSON.stringify(report.data) : '';
    const previousReport = prevProps.report && prevProps.report.data ? JSON.stringify(prevProps.report.data) : '';

    if (
      previousReport !== currentReport ||
      prevProps.selectedItems !== selectedItems ||
      prevProps.hiddenColumns !== hiddenColumns
    ) {
      this.initDatum();
    }
  }

  private initDatum = () => {
    const { groupBy, groupByTagKey, hiddenColumns, intl, isAllSelected, report, router, selectedItems } = this.props;
    if (!report) {
      return;
    }

    const showDefaultProject = groupBy === 'project';

    const rows = [];
    const computedItems = getUnsortedComputedReportItems({
      report,
      idKey: groupByTagKey ? groupByTagKey : groupBy,
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
            hidden: !showDefaultProject,
            name: '', // Default column
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
            orderBy: groupBy,
            name: intl.formatMessage(messages.detailsResourceNames, { value: groupBy }),
            ...(computedItems.length && { isSortable: true }),
            style: groupBy === 'project' ? styles.nameColumn : undefined,
          },
          {
            hidden: !showDefaultProject,
            name: '', // Default column
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
      const cost = this.getTotalCost(item, index);
      const label = item && item.label !== null ? item.label : '';
      const monthOverMonth = this.getMonthOverMonthCost(item, index);
      const supplementaryCost = this.getSupplementaryCost(item, index);
      const InfrastructureCost = this.getInfrastructureCost(item, index);
      const isPlatformCosts = item.classification === classificationPlatform;
      const isUnallocatedCosts = item.classification === classificationUnallocated;
      const desc = item.id && item.id !== item.label ? <div style={styles.infoDescription}>{item.id}</div> : null;
      const isDisabled =
        label === `${noPrefix}${groupBy}` || label === `${noPrefix}${groupByTagKey}` || isUnallocatedCosts;
      const actions = this.getActions(item, isDisabled);

      const name = isDisabled ? (
        (label as any)
      ) : (
        <Link
          to={getBreakdownPath({
            basePath: paths.ocpDetailsBreakdown,
            label: label.toString(),
            description: item.id,
            isPlatformCosts,
            groupBy,
            router,
          })}
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
            hidden: !showDefaultProject,
            value:
              item.classification === classificationDefault ? (
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
          { value: <div>{InfrastructureCost}</div>, id: DetailsTableColumnIds.infrastructure },
          { value: <div>{supplementaryCost}</div>, id: DetailsTableColumnIds.supplementary },
          { value: <div>{cost}</div> },
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
    const { isLoading, onSelected, onSort, selectedItems } = this.props;
    const { columns, rows } = this.state;

    return (
      <DataTable
        columns={columns}
        isLoading={isLoading}
        onSelected={onSelected}
        onSort={onSort}
        rows={rows}
        selectedItems={selectedItems}
      />
    );
  }
}

const DetailsTable = injectIntl(withRouter(DetailsTableBase));

export { DetailsTable };
export type { DetailsTableProps };
