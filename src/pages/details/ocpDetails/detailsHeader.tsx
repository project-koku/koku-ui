import { Popover, Title, TitleSize, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import {
  ComputedOcpReportItemsParams,
  getIdKeyForGroupBy,
} from 'utils/computedReport/getComputedOcpReportItems';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
}

interface DetailsHeaderStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString: string;
  report: OcpReport;
  reportError?: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface DetailsHeaderDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface DetailsHeaderState {
  showPopover: boolean;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  DetailsHeaderDispatchProps &
  InjectedTranslateProps;

const baseQuery: OcpQuery = {
  delta: 'cost',
  filter: {
    time_scope_units: 'month',
    time_scope_value: -1,
    resolution: 'monthly',
  },
};

const groupByOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'node', value: 'node' },
  { label: 'project', value: 'project' },
];

const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  protected defaultState: DetailsHeaderState = {
    showPopover: false,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(reportPathsType, reportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsHeaderProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  private handlePopoverClick = () => {
    this.setState({
      show: !this.state.showPopover,
    });
  };

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

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report && report.meta && report.meta.total) {
      const hasCost = report.meta.total.cost && report.meta.total.cost.total;
      const hasSupplementaryCost =
        report.meta.total.supplementary &&
        report.meta.total.supplementary.total;
      const hasInfrastructureCost =
        report.meta.total.infrastructure &&
        report.meta.total.infrastructure.total;
      cost = formatValue(
        hasCost ? report.meta.total.cost.total.value : 0,
        hasCost ? report.meta.total.cost.total.units : 'USD'
      );
      supplementaryCost = formatValue(
        hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
        hasSupplementaryCost
          ? report.meta.total.supplementary.total.units
          : 'USD'
      );
      infrastructureCost = formatValue(
        hasInfrastructureCost
          ? report.meta.total.infrastructure.total.value
          : 0,
        hasInfrastructureCost
          ? report.meta.total.infrastructure.total.units
          : 'USD'
      );
    }

    return (
      <header style={styles.header}>
        <div>
          <Title style={styles.title} size={TitleSize['2xl']}>
            {t('ocp_details.title')}
          </Title>
          {Boolean(showContent) && (
            <GroupBy
              getIdKeyForGroupBy={getIdKeyForGroupBy}
              groupBy={groupBy}
              onItemClicked={onGroupByClicked}
              options={groupByOptions}
              reportPathsType={reportPathsType}
            />
          )}
        </div>
        {Boolean(showContent) && (
          <div style={styles.cost}>
            <Title style={styles.costValue} size="4xl">
              <Tooltip
                content={t('ocp_details.total_cost_tooltip', {
                  supplementaryCost,
                  infrastructureCost,
                })}
                enableFlip
              >
                <span>{cost}</span>
              </Tooltip>
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>
                {t('ocp_details.total_cost')}
                <span style={styles.infoIcon}>
                  <Popover
                    aria-label="t('ocp_details.supplementary_aria_label')"
                    enableFlip
                    bodyContent={
                      <>
                        <p style={styles.infoTitle}>
                          {t('ocp_details.supplementary_cost_title')}
                        </p>
                        <p>{t('ocp_details.supplementary_cost_desc')}</p>
                        <br />
                        <p style={styles.infoTitle}>
                          {t('ocp_details.infrastructure_cost_title')}
                        </p>
                        <p>{t('ocp_details.infrastructure_cost_desc')}</p>
                      </>
                    }
                  >
                    <InfoCircleIcon
                      style={styles.info}
                      onClick={this.handlePopoverClick}
                    />
                  </Popover>
                </span>
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
  const report = reportSelectors.selectReport(state, reportType, queryString);
  const reportError = reportSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
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
  fetchReport: reportActions.fetchReport,
};

const DetailsHeader = translate()(
  connect(mapStateToProps, mapDispatchToProps)(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
