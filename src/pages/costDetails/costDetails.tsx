import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, parseQuery, Query } from 'api/query';
import { Report, ReportType } from 'api/reports';
import { ListView } from 'patternfly-react';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportsActions, reportsSelectors } from 'store/reports';
import { formatCurrency } from 'utils/formatValue';
import {
  getComputedReportItems,
  GetComputedReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/getComputedReportItems';
import {
  listViewOverride,
  styles,
  toolbarOverride,
} from './costDetails.styles';
import { DetailsItem } from './detailItem';
import { DetailsToolbar } from './detailsToolbar';

interface StateProps {
  report: Report;
  reportFetchStatus: FetchStatus;
  queryString: string;
  query: Query;
}

interface DispatchProps {
  fetchReport: typeof reportsActions.fetchReport;
}

type OwnProps = RouteComponentProps<void> & InjectedTranslateProps;

type Props = StateProps & OwnProps & DispatchProps;

const reportType = ReportType.cost;

const baseQuery: Query = {
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
  group_by: {
    account: '*',
  },
};

const groupByOptions: {
  label: string;
  value: GetComputedReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

class CostDetails extends React.Component<Props> {
  public componentDidMount() {
    const { query, location, fetchReport, history, queryString } = this.props;
    if (!location.search) {
      history.replace(this.getRouteForQuery({ group_by: query.group_by }));
    } else {
      fetchReport(reportType, queryString);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      prevProps.queryString !== this.props.queryString ||
      !this.props.report
    ) {
      this.props.fetchReport(reportType, this.props.queryString);
    }
  }

  public handleSelectChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const groupByKey: keyof Query['group_by'] = event.currentTarget
      .value as any;
    const { history } = this.props;
    const newQuery: Query = {
      group_by: {
        [groupByKey]: '*',
      },
    };
    history.replace(this.getRouteForQuery(newQuery));
  };

  private getRouteForQuery(query: Query) {
    return `/cost?${getQuery(query)}`;
  }

  public render() {
    const { report, query, t } = this.props;
    const groupById = getIdKeyForGroupBy(query.group_by);
    const today = new Date();
    const computedItems = getComputedReportItems({
      report,
      idKey: groupById,
    });

    const filterFields = [
      {
        id: 'account',
        title: t('cost_details.filter.account_select'),
        placeholder: t('cost_details.filter.account_placeholder'),
        filterType: 'text',
      },
      {
        id: 'service',
        title: t('cost_details.filter.service_select'),
        placeholder: t('cost_details.filter.service_placeholder'),
        filterType: 'text',
      },
      {
        id: 'region',
        title: t('cost_details.filter.region_select'),
        placeholder: t('cost_details.filter.region_placeholder'),
        filterType: 'text',
      },
    ];

    const sortFields = [
      { id: 'cost', title: t('cost_details.order.cost'), isNumeric: true },
      {
        id: 'costdelta',
        title: t('cost_details.order.cost_delta'),
        isNumeric: true,
      },
      { id: 'name', title: t('cost_details.order.name'), isNumeric: false },
    ];

    const exportText = t('cost_details.export_link');

    return (
      <div className={css(styles.costDetailsPage)}>
        <header className={css(styles.header)}>
          <div>
            <Title size="2xl">{t('cost_details.title')}</Title>
            <div className={css(styles.groupBySelector)}>
              <label className={css(styles.groupBySelectorLabel)}>
                {t('group_by.label')}:
              </label>
              <select value={groupById} onChange={this.handleSelectChange}>
                {groupByOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {t(`group_by.values.${option.label}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {Boolean(report) && (
            <div className={css(styles.total)}>
              <Title className={css(styles.totalValue)} size="4xl">
                {formatCurrency(report.total.value)}
              </Title>
              <div className={css(styles.totalLabel)}>
                <div className={css(styles.totalLabelUnit)}>
                  {t('total_cost')}
                </div>
                <div className={css(styles.totalLabelDate)}>
                  {t('since_date', { month: today.getMonth(), date: 1 })}
                </div>
              </div>
            </div>
          )}
        </header>
        <div className={css(styles.content)}>
          <div className={css(styles.toolbarContainer)}>
            <div className={toolbarOverride}>
              <DetailsToolbar
                filterFields={filterFields}
                sortFields={sortFields}
                exportText={exportText}
              />
            </div>
          </div>

          <div className={listViewOverride}>
            <ListView>
              <ListView.Item
                key="header_item"
                heading={t('cost_details.name_column_title', {
                  groupBy: groupById,
                })}
                checkboxInput={<input type="checkbox" />}
                additionalInfo={[
                  <ListView.InfoItem key="1">
                    <strong>{t('cost_details.cost_column_title')}</strong>
                    {Boolean(report) && (
                      <span>
                        {t('cost_details.cost_column_subtitle', {
                          total: formatCurrency(report.total.value),
                        })}
                      </span>
                    )}
                  </ListView.InfoItem>,
                ]}
              />
              {computedItems.map((groupItem, index) => {
                return (
                  <DetailsItem
                    key={index}
                    parentQuery={query}
                    parentGroupBy={groupById}
                    item={groupItem}
                    total={report.total.value}
                  />
                );
              })}
            </ListView>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<OwnProps, StateProps>(
  (state, props) => {
    const queryFromRoute = parseQuery<Query>(props.location.search);
    const query = {
      filter: {
        ...baseQuery.filter,
        ...queryFromRoute.filter,
      },
      group_by: queryFromRoute.group_by || baseQuery.group_by,
    };
    const queryString = getQuery(query);
    const report = reportsSelectors.selectReport(
      state,
      ReportType.cost,
      queryString
    );
    const reportFetchStatus = reportsSelectors.selectReportFetchStatus(
      state,
      ReportType.cost,
      queryString
    );
    return {
      report,
      reportFetchStatus,
      queryString,
      query,
    };
  }
);

const mapDispatchToProps: DispatchProps = {
  fetchReport: reportsActions.fetchReport,
};

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CostDetails)
);
