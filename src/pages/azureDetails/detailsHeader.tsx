import { Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AzureQuery, getQuery } from 'api/azureQuery';
import { AzureReport, AzureReportType } from 'api/azureReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import { TertiaryNav, TertiaryNavItem } from 'components/details/tertiaryNav';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { azureReportsActions, azureReportsSelectors } from 'store/azureReports';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { azureProvidersQuery, providersSelectors } from 'store/providers';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';
import { GroupBy } from './groupBy';

interface DetailsHeaderOwnProps {
  onGroupByClicked(value: string);
}

interface DetailsHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  report: AzureReport;
  reportError?: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface DetailsHeaderDispatchProps {
  fetchReport?: typeof azureReportsActions.fetchReport;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  DetailsHeaderDispatchProps &
  InjectedTranslateProps;

const baseQuery: AzureQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const reportType = AzureReportType.cost;

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
      onGroupByClicked,
      providers,
      providersError,
      report,
      reportError,
      t,
    } = this.props;
    const today = new Date();
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
            <TertiaryNav activeItem={TertiaryNavItem.azure} />
          </div>
          {Boolean(showContent) && <GroupBy onItemClicked={onGroupByClicked} />}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.cost)}>
            <Title className={css(styles.costValue)} size="4xl">
              {formatCurrency(report.meta.total.cost.value)}
            </Title>
            <div className={css(styles.costLabel)}>
              <div className={css(styles.costLabelUnit)}>
                {t('azure_details.total_cost')}
              </div>
              <div className={css(styles.costLabelDate)}>
                {t('since_date', { month: today.getMonth(), date: 1 })}
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
  const report = azureReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = azureReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = azureReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(azureProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.azure,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.azure,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.azure,
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
  fetchReport: azureReportsActions.fetchReport,
};

const DetailsHeader = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
