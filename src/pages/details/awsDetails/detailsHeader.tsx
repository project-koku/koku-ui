import { Title, TitleSizes } from '@patternfly/react-core';
import { Providers, ProviderType } from 'api/providers';
import { AwsQuery, getQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { AwsReport } from 'api/reports/awsReports';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
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
  ComputedAwsReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/computedReport/getComputedAwsReportItems';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  report: AwsReport;
}

interface DetailsHeaderStateProps {
  queryString?: string;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  InjectedTranslateProps;

const baseQuery: AwsQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedAwsReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const reportPathsType = ReportPathsType.aws;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  public render() {
    const {
      groupBy,
      onGroupByClicked,
      providers,
      providersError,
      report,
      t,
    } = this.props;
    const showContent =
      report &&
      !providersError &&
      providers &&
      providers.meta &&
      providers.meta.count > 0;

    const hasCost =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;

    return (
      <header style={styles.header}>
        <div>
          <Title
            headingLevel="h2"
            style={styles.title}
            size={TitleSizes['2xl']}
          >
            {t('navigation.infrastructure_details')}
          </Title>
          <div style={styles.nav}>
            <TertiaryNav activeItem={TertiaryNavItem.aws} />
          </div>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            reportPathsType={reportPathsType}
          />
        </div>
        {Boolean(showContent) && (
          <div style={styles.cost}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
              {formatCurrency(hasCost ? report.meta.total.cost.total.value : 0)}
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>
                {t('aws_details.total_cost')}
              </div>
              <div style={styles.costLabelDate}>
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
  };
});

const DetailsHeader = translate()(
  connect(mapStateToProps, {})(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
