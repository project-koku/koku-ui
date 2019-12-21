import { Title, TitleSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpCloudQuery } from 'api/ocpCloudQuery';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/ocpCloudReports';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';
import { GroupBy } from './groupBy';

interface DetailsHeaderOwnProps {
  onGroupByClicked(value: string);
}

interface DetailsHeaderStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString: string;
  report: OcpCloudReport;
  reportError?: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface DetailsHeaderDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  DetailsHeaderDispatchProps &
  InjectedTranslateProps;

const reportType = OcpCloudReportType.cost;

const baseQuery: OcpCloudQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

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
            {t('ocp_on_cloud_details.title')}
          </Title>
          {Boolean(showContent) && <GroupBy onItemClicked={onGroupByClicked} />}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.cost)}>
            <Title className={css(styles.costValue)} size="4xl">
              {formatCurrency(report.meta.total.infrastructure_cost.value)}
            </Title>
            <div className={css(styles.costLabel)}>
              <div className={css(styles.costLabelUnit)}>
                {t('ocp_on_cloud_details.total_cost')}
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
  const report = ocpCloudReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = ocpCloudReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    reportType,
    queryString
  );

  const providersQueryString = getProvidersQuery(ocpProvidersQuery);
  const providers = providersSelectors.selectProviders(
    state,
    ProviderType.ocp,
    providersQueryString
  );
  const providersError = providersSelectors.selectProvidersError(
    state,
    ProviderType.ocp,
    providersQueryString
  );
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
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
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const DetailsHeader = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
