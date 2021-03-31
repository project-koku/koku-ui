import { Skeleton, Title } from '@patternfly/react-core';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { Report } from 'api/reports/report';
import { UserAccessType } from 'api/userAccess';
import { AxiosError } from 'axios';
import { ChartDatum, ComputedReportItemType, isFloat, isInt } from 'components/charts/common/chartDatumUtils';
import { CostExplorerChart } from 'components/charts/costExplorerChart';
import { format, getDate, getMonth } from 'date-fns';
import { getGroupByOrgValue, getGroupByTagKey } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { allUserAccessQuery, userAccessSelectors } from 'store/userAccess';
import { getIdKeyForGroupBy } from 'utils/computedReport/getComputedExplorerReportItems';
import { ComputedReportItem, getUnsortedComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { formatValue } from 'utils/formatValue';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './explorerChart.styles';
import {
  baseQuery,
  getDateRange,
  getDateRangeDefault,
  getGroupByDefault,
  getPerspectiveDefault,
  getReportPathsType,
  getReportType,
  PerspectiveType,
} from './explorerUtils';

interface ExplorerChartOwnProps extends RouteComponentProps<void>, WithTranslation {
  computedReportItemType?: ComputedReportItemType;
}

interface ExplorerChartStateProps {
  end_date?: string;
  perspective: PerspectiveType;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  start_date?: string;
}

interface ExplorerChartDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
}

interface ExplorerChartState {
  // TBD...
}

type ExplorerChartProps = ExplorerChartStateProps & ExplorerChartOwnProps & ExplorerChartDispatchProps;

class ExplorerChartBase extends React.Component<ExplorerChartProps> {
  protected defaultState: ExplorerChartState = {};
  public state: ExplorerChartState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
  }

  public componentDidMount() {
    this.fetchReport();
  }

  public componentDidUpdate(prevProps: ExplorerChartProps) {
    const { report, reportError, queryString } = this.props;

    const newQuery = prevProps.queryString !== queryString;
    const noReport = !report && !reportError;

    if (newQuery || noReport) {
      this.fetchReport();
    }
  }

  private createReportDatum = (
    value: number,
    computedItem: ComputedReportItem,
    reportItem: string = 'cost',
    reportItemValue: string = 'total'
  ): ChartDatum => {
    const { t } = this.props;

    const computedItemDate = new Date(computedItem.date + 'T00:00:00');
    const xVal = t('chart.date', { date: getDate(computedItemDate), month: getMonth(computedItemDate) });
    const yVal = isFloat(value) ? parseFloat(value.toFixed(2)) : isInt(value) ? value : 0;
    return {
      x: xVal,
      y: value === null ? null : yVal, // For displaying "no data" labels in chart tooltips
      date: computedItem.date,
      key: computedItem.id,
      name: computedItem.label || computedItem.id,
      units: computedItem[reportItem]
        ? computedItem[reportItem][reportItemValue]
          ? computedItem[reportItem][reportItemValue].units // cost, infrastructure, supplementary
          : computedItem[reportItem].units // capacity, limit, request, usage
        : undefined,
    };
  };

  private fetchReport = () => {
    const { fetchReport, perspective, queryString } = this.props;

    const reportPathsType = getReportPathsType(perspective);
    const reportType = getReportType(perspective);

    fetchReport(reportPathsType, reportType, queryString);
  };

  private getChartDatums = (computedItems: ComputedReportItem[]) => {
    const { computedReportItemType = ComputedReportItemType.cost } = this.props;

    const reportItem = computedReportItemType;
    const reportItemValue = 'total';
    const chartDatums = [];

    computedItems.map(computedItem => {
      const datums = [];

      if (computedItem instanceof Map) {
        const items = Array.from(computedItem.values());
        items.map(i => {
          const val = i[reportItem][reportItemValue] ? i[reportItem][reportItemValue].value : i[reportItem].value;
          datums.push(this.createReportDatum(val, i, reportItem, reportItemValue));
        });
      }
      chartDatums.push(datums);
    });
    return this.padChartDatums(chartDatums);
  };

  private getChartTitle = (perspective: string) => {
    let result;
    switch (perspective) {
      case PerspectiveType.allCloud:
        result = 'explorer.title.all_cloud';
        break;
      case PerspectiveType.aws:
        result = 'explorer.title.aws';
        break;
      case PerspectiveType.awsCloud:
        result = 'explorer.title.aws_cloud';
        break;
      case PerspectiveType.azure:
        result = 'explorer.title.azure';
        break;
      case PerspectiveType.azureCloud:
        result = 'explorer.title.azure_cloud';
        break;
      case PerspectiveType.gcp:
        result = 'explorer.title.gcp';
        break;
      case PerspectiveType.ibm:
        result = 'explorer.title.ibm';
        break;
      case PerspectiveType.ocp:
        result = 'explorer.title.ocp';
        break;
      case PerspectiveType.ocpSupplementary:
        result = 'explorer.title.ocp_supplementary';
        break;
      case PerspectiveType.ocpUsage:
        result = 'explorer.title.ocp_usage';
        break;
      default:
        result = undefined;
        break;
    }
    return result;
  };

  private getComputedItems = () => {
    const { report } = this.props;

    return getUnsortedComputedReportItems({
      report,
      idKey: this.getGroupBy(),
      daily: true,
    });
  };

  private getGroupBy = () => {
    const { query } = this.props;

    const groupById = getIdKeyForGroupBy(query.group_by);
    const groupByOrg = getGroupByOrgValue(query);
    const groupByTagKey = getGroupByTagKey(query);

    return groupByTagKey ? groupByTagKey : groupByOrg ? 'org_entities' : groupById;
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
    const { end_date, start_date } = this.props;
    const result = [];

    items.map(datums => {
      const key = datums[0].key;
      const newItems = [];

      for (
        let padDate = new Date(start_date + 'T00:00:00');
        padDate <= new Date(end_date + 'T00:00:00');
        padDate.setDate(padDate.getDate() + 1)
      ) {
        const id = format(padDate, 'yyyy-MM-dd');
        const chartDatum = datums.find(val => val.date === id);
        if (chartDatum) {
          newItems.push(chartDatum);
        } else {
          const date = format(padDate, 'yyyy-MM-dd');
          newItems.push(this.createReportDatum(null, { date, id: key }, 'cost', null));
        }
      }
      result.push(newItems);
    });
    return result;
  };

  public render() {
    const { perspective, reportFetchStatus, t } = this.props;

    const datums = this.getChartDatums(this.getComputedItems());

    // Todo: get title from perspective menu
    return (
      <>
        <div style={styles.titleContainer}>
          <Title headingLevel="h3" size="md">
            {t(this.getChartTitle(perspective))}
          </Title>
        </div>
        <div style={styles.chartContainer}>
          <div style={styles.costChart}>
            {reportFetchStatus === FetchStatus.inProgress ? (
              this.getSkeleton()
            ) : (
              <CostExplorerChart
                adjustContainerHeight
                containerHeight={chartStyles.chartContainerHeight}
                formatDatumValue={formatValue}
                formatDatumOptions={{}}
                height={chartStyles.chartHeight}
                top1stData={datums.length > 0 ? datums[0] : []}
                top2ndData={datums.length > 1 ? datums[1] : []}
                top3rdData={datums.length > 2 ? datums[2] : []}
                top4thData={datums.length > 3 ? datums[3] : []}
                top5thData={datums.length > 4 ? datums[4] : []}
                top6thData={datums.length > 5 ? datums[5] : []}
              />
            )}
          </div>
        </div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerChartOwnProps, ExplorerChartStateProps>((state, props) => {
  const userAccessQueryString = getUserAccessQuery(allUserAccessQuery);
  const userAccess = userAccessSelectors.selectUserAccess(state, UserAccessType.all, userAccessQueryString);

  const queryFromRoute = parseQuery<Query>(location.search);
  const perspective = getPerspectiveDefault(queryFromRoute, userAccess);
  const dateRange = getDateRangeDefault(queryFromRoute);
  const { end_date, start_date } = getDateRange(queryFromRoute);

  const query = {
    filter: {
      ...baseQuery.filter,
      ...queryFromRoute.filter,
      limit: 5,
      offset: undefined,
    },
    filter_by: queryFromRoute.filter_by || baseQuery.filter_by,
    group_by: queryFromRoute.group_by || { [getGroupByDefault(perspective)]: '*' } || baseQuery.group_by,
    perspective,
    dateRange,
    end_date,
    start_date,
  };
  const queryString = getQuery({
    ...query,
    perspective: undefined,
    dateRange: undefined,
  });

  const reportPathsType = getReportPathsType(perspective);
  const reportType = getReportType(perspective);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  return {
    end_date,
    perspective,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    start_date,
  };
});

const mapDispatchToProps: ExplorerChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const ExplorerChartConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerChartBase);
const ExplorerChart = withRouter(withTranslation()(ExplorerChartConnect));

export { ExplorerChart, ExplorerChartProps };
