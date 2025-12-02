import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import type { Report } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Skeleton, Title, TitleSizes } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps, FetchStatus } from '../../store/common';
import { reportActions, reportSelectors } from '../../store/reports';
import { formatUnits } from '../../utils/format';
import type { RouterComponentProps } from '../../utils/router';
import { withRouter } from '../../utils/router';
import { getCostDistribution } from '../../utils/sessionStorage';
import type { ChartDatum } from '../components/charts/common/chartDatum';
import {
  ComputedReportItemType,
  ComputedReportItemValueType,
  isFloat,
  isInt,
} from '../components/charts/common/chartDatum';
import { CostExplorerChart } from '../components/charts/costExplorerChart';
import { getIdKeyForGroupBy } from '../utils/computedReport/getComputedExplorerReportItems';
import type { ComputedReportItem } from '../utils/computedReport/getComputedReportItems';
import { getUnsortedComputedReportItems } from '../utils/computedReport/getComputedReportItems';
import { getGroupByCostCategory, getGroupById, getGroupByOrgValue, getGroupByTagKey } from '../utils/groupBy';
import { skeletonWidth } from '../utils/skeleton';
import { chartStyles, styles } from './explorerChart.styles';
import { getExplorerSkeletonData } from './explorerSkeletonData';
import { PerspectiveType } from './explorerUtils';
import { getGroupByDefault, getReportPathsType, getReportType } from './explorerUtils';

interface ExplorerChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  costDistribution?: string;
  costType?: string;
  currency?: string;
  endDate?: string;
  groupBy?: string;
  perspective: PerspectiveType;
  startDate?: string;
}

interface ExplorerChartStateProps {
  perspective: PerspectiveType;
  query: Query;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportQueryString: string;
}

interface ExplorerChartDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface ExplorerChartState {
  // TBD...
}

type ExplorerChartProps = ExplorerChartStateProps & ExplorerChartOwnProps & ExplorerChartDispatchProps;

class ExplorerChartBase extends React.Component<ExplorerChartProps, ExplorerChartState> {
  protected defaultState: ExplorerChartState = {};
  public state: ExplorerChartState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidMount() {
    this.updateReport();
  }

  public componentDidUpdate(prevProps: ExplorerChartProps) {
    const { report, reportError, reportQueryString } = this.props;

    const newQuery = prevProps.reportQueryString !== reportQueryString;
    const noReport = !report && !reportError;

    if (newQuery || noReport) {
      this.updateReport();
    }
  }

  private createReportDatum = (
    value: number,
    computedItem: ComputedReportItem,
    reportItem: string = 'cost',
    reportItemValue: string = 'total'
  ): ChartDatum => {
    const { intl } = this.props;

    const computedItemDate = new Date(computedItem.date + 'T00:00:00');
    const xVal = intl.formatDate(computedItemDate, {
      day: 'numeric',
      month: 'short',
    });
    const yVal = isFloat(value) ? parseFloat(value.toFixed(2)) : isInt(value) ? value : 0;
    return {
      x: xVal,
      y: value === null ? null : yVal, // For displaying "no data" labels in chart tooltips
      ...(value === null && { _y: 0 }), // Force "no data" tooltips. See https://issues.redhat.com/browse/COST-1765
      date: computedItem.date,
      key: computedItem.id,
      name: computedItem.label ? computedItem.label : computedItem.id, // legend item label
      units: computedItem[reportItem]
        ? computedItem[reportItem][reportItemValue]
          ? computedItem[reportItem][reportItemValue].units // cost, infrastructure, supplementary
          : computedItem[reportItem].units // capacity, limit, request, usage
        : undefined,
    };
  };

  private updateReport = () => {
    const { fetchReport, perspective, reportQueryString } = this.props;

    if (perspective) {
      const reportPathsType = getReportPathsType(perspective);
      const reportType = getReportType(perspective);

      fetchReport(reportPathsType, reportType, reportQueryString);
    }
  };

  private getChartDatums = (computedItems: ComputedReportItem[]) => {
    const { costDistribution } = this.props;

    const reportItem = ComputedReportItemType.cost;
    const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
    const chartDatums = [];

    computedItems.map(computedItem => {
      const datums = [];

      if (computedItem instanceof Map) {
        const items = Array.from(computedItem.values());
        items.map((i: any) => {
          const val = i[reportItem][reportItemValue] ? i[reportItem][reportItemValue].value : i[reportItem].value;
          datums.push(this.createReportDatum(val, i, reportItem, reportItemValue));
        });
      }
      chartDatums.push(datums);
    });
    return this.padChartDatums(chartDatums);
  };

  private getComputedItems = () => {
    const { report } = this.props;

    const computedReportItems = getUnsortedComputedReportItems({
      report,
      idKey: this.getGroupBy(),
      isDateMap: true,
    });

    // Move "Others" to be the last legend label
    for (let i = 0; i < computedReportItems.length; i++) {
      let found = false;
      for (const item of computedReportItems[i]) {
        if (item[item.length - 1].id === 'Others') {
          computedReportItems.push(computedReportItems.splice(i, 1)[0]);
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }
    return computedReportItems;
  };

  private getGroupBy = () => {
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByCostCategory = getGroupByCostCategory(query);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    return groupByCostCategory
      ? groupByCostCategory
      : groupByTagKey
        ? groupByTagKey
        : groupByOrg
          ? 'org_entities'
          : groupById;
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  // This pads chart datums with null datum objects, representing missing data at the beginning and end of the
  // data series. The remaining data is left as is to allow for extrapolation. This allows us to display a "no data"
  // message in the tooltip, which helps distinguish between zero values and when there is no data available.
  private padChartDatums = (items: any[]): ChartDatum[] => {
    const { endDate, startDate } = this.props;
    const result = [];

    items.map(datums => {
      const key = datums[0].key;
      const label = datums[0].name;
      const newItems = [];

      for (
        let padDate = new Date(startDate + 'T00:00:00');
        padDate <= new Date(endDate + 'T00:00:00');
        padDate.setDate(padDate.getDate() + 1)
      ) {
        const id = format(padDate, 'yyyy-MM-dd');
        const chartDatum = datums.find(val => val.date === id);
        if (chartDatum) {
          newItems.push(chartDatum);
        } else {
          const date = format(padDate, 'yyyy-MM-dd');
          newItems.push(this.createReportDatum(null, { date, id: key, label }, 'cost', null));
        }
      }
      result.push(newItems);
    });
    return result;
  };

  public render() {
    const { perspective, report, reportFetchStatus, intl } = this.props;

    let datums = this.getChartDatums(this.getComputedItems());
    let isSkeleton = false;

    if (report && datums.length === 0) {
      isSkeleton = true;
      datums = getExplorerSkeletonData(report?.meta?.count) as any;
    }

    // Todo: get title from perspective menu
    return (
      <>
        <Title headingLevel="h3" size={TitleSizes.md}>
          {intl.formatMessage(messages.explorerChartTitle, { value: perspective })}
        </Title>
        <div style={styles.costChart}>
          {reportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <CostExplorerChart
              baseHeight={chartStyles.chartHeight}
              formatOptions={{}}
              formatter={formatUnits}
              isSkeleton={isSkeleton}
              top1stData={datums.length > 0 ? datums[0] : []}
              top2ndData={datums.length > 1 ? datums[1] : []}
              top3rdData={datums.length > 2 ? datums[2] : []}
              top4thData={datums.length > 3 ? datums[3] : []}
              top5thData={datums.length > 4 ? datums[4] : []}
              top6thData={datums.length > 5 ? datums[5] : []}
            />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExplorerChartOwnProps, ExplorerChartStateProps>(
  (state, { costType, currency, endDate, perspective, router, startDate }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupByDefault(perspective);
    const group_by = queryFromRoute.group_by ? queryFromRoute.group_by : { [groupBy]: '*' }; // Ensure group_by key is not undefined

    const costDistribution =
      perspective === PerspectiveType.ocp && groupBy === 'project' ? getCostDistribution() : undefined;

    const query: any = {
      ...queryFromRoute,
      group_by, // Note that this is not the group by ID
    };
    const reportQuery = {
      cost_type: costType,
      currency,
      end_date: endDate,
      exclude: query.exclude,
      filter: { limit: 5 },
      filter_by: query.filter_by,
      group_by,
      start_date: startDate,
      ...(costDistribution === ComputedReportItemValueType.distributed && {
        order_by: { distributed_cost: 'desc' },
      }),
    };

    const reportPathsType = getReportPathsType(perspective);
    const reportType = getReportType(perspective);

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      perspective,
      query,
      report,
      reportError,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: ExplorerChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const ExplorerChartConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerChartBase);
const ExplorerChart = injectIntl(withRouter(ExplorerChartConnect));

export { ExplorerChart };
export type { ExplorerChartProps };
