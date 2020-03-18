import { Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Providers, ProviderType } from 'api/providers';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AwsReport } from 'api/reports/awsReports';
import { ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import {
  TertiaryNav,
  TertiaryNavItem,
} from 'pages/details/components/nav/tertiaryNav';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import {
  awsReportsActions,
  awsReportsSelectors,
} from 'store/reports/awsReports';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';
import { GroupBy } from './groupBy';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
}

interface DetailsHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  report: AwsReport;
  reportError?: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface DetailsHeaderDispatchProps {
  fetchReport?: typeof awsReportsActions.fetchReport;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  DetailsHeaderDispatchProps &
  InjectedTranslateProps;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const reportType = ReportType.cost;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsHeaderProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportType, queryString);
    }
  }

  public render() {
    const {
      groupBy,
      onGroupByClicked,
      providers,
      providersError,
      report,
      reportError,
      t,
    } = this.props;
    const showContent =
      report &&
      !reportError &&
      !providersError &&
      providers &&
      providers.meta &&
      providers.meta.count > 0;

    return (
      <header className={css(styles.header)}>
        <div>
          <Title className={css(styles.title)} size={TitleSize['2xl']}>
            {t('navigation.cloud_details')}
          </Title>
          <div className={css(styles.nav)}>
            <TertiaryNav activeItem={TertiaryNavItem.aws} />
          </div>
          {Boolean(showContent) && (
            <GroupBy groupBy={groupBy} onItemClicked={onGroupByClicked} />
          )}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.cost)}>
            <Title className={css(styles.costValue)} size="4xl">
              {formatCurrency(report.meta.total.cost.value)}
            </Title>
            <div className={css(styles.costLabel)}>
              <div className={css(styles.costLabelUnit)}>
                {t('aws_details.total_cost')}
              </div>
              <div className={css(styles.costLabelDate)}>
                {getSinceDateRangeString()}
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsHeaderOwnProps,
  DetailsHeaderStateProps
>((state, props) => {
  const queryString = getQuery(baseQuery);
  const report = awsReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = awsReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = awsReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(awsProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.aws,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    providersQueryString
  );

  return {
    providers,
    providersError,
    providersFetchStatus,
    queryString,
    report,
    reportError,
    reportFetchStatus,
  };
});

const mapDispatchToProps: DetailsHeaderDispatchProps = {
  fetchReport: awsReportsActions.fetchReport,
};

const DetailsHeader = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
