import { Popover, Title, TitleSize, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import {
  OcpCloudReport,
  OcpCloudReportType,
} from 'api/reports/ocpCloudReports';
import { AxiosError } from 'axios';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import {
  ocpCloudReportsActions,
  ocpCloudReportsSelectors,
} from 'store/reports/ocpCloudReports';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';
import { styles } from './detailsHeader.styles';
import { GroupBy } from './groupBy';

interface DetailsHeaderOwnProps {
  groupBy?: string;
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

interface DetailsHeaderState {
  showPopover: boolean;
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
  protected defaultState: DetailsHeaderState = {
    showPopover: false,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

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
    let markupCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report && report.meta && report.meta.total) {
      cost = formatValue(
        report.meta.total.derived_cost ? report.meta.total.cost.value : 0,
        report.meta.total.derived_cost
          ? report.meta.total.derived_cost.units
          : 'USD'
      );
      markupCost = formatValue(
        report.meta.total.markup_cost ? report.meta.total.markup_cost.value : 0,
        report.meta.total.derived_cost
          ? report.meta.total.derived_cost.units
          : 'USD'
      );
      infrastructureCost = formatValue(
        report.meta.total.infrastructure_cost
          ? report.meta.total.infrastructure_cost.value
          : 0,
        report.meta.total.infrastructure_cost
          ? report.meta.total.infrastructure_cost.units
          : 'USD'
      );
    }

    return (
      <header className={css(styles.header)}>
        <div>
          <Title className={css(styles.title)} size={TitleSize['2xl']}>
            {t('ocp_cloud_details.title')}
          </Title>
          {Boolean(showContent) && (
            <GroupBy groupBy={groupBy} onItemClicked={onGroupByClicked} />
          )}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.cost)}>
            <Title className={css(styles.costValue)} size="4xl">
              <Tooltip
                content={t('ocp_cloud_details.total_cost_tooltip', {
                  infrastructureCost,
                  markupCost,
                })}
                enableFlip
              >
                <span>{cost}</span>
              </Tooltip>
            </Title>
            <div className={css(styles.costLabel)}>
              <div className={css(styles.costLabelUnit)}>
                {t('ocp_cloud_details.total_cost')}
                <span className={css(styles.infoIcon)}>
                  <Popover
                    aria-label="t('ocp_cloud_details.markup_aria_label')"
                    enableFlip
                    bodyContent={
                      <>
                        <p className={css(styles.infoTitle)}>
                          {t('ocp_cloud_details.infrastructure_cost_title')}
                        </p>
                        <p>{t('ocp_cloud_details.infrastructure_cost_desc')}</p>
                        <br />
                        <p className={css(styles.infoTitle)}>
                          {t('ocp_cloud_details.markup_title')}
                        </p>
                        <p>{t('ocp_cloud_details.markup_desc')}</p>
                      </>
                    }
                  >
                    <InfoCircleIcon
                      className={css(styles.info)}
                      onClick={this.handlePopoverClick}
                    />
                  </Popover>
                </span>
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
  connect(mapStateToProps, mapDispatchToProps)(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
