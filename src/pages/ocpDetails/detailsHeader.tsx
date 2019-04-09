import { Popover, Title, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { Providers, ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/providersQuery';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { formatValue } from 'utils/formatValue';
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
  report: OcpReport;
  reportError?: AxiosError;
  reportFetchStatus: FetchStatus;
}

interface DetailsHeaderDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

interface DetailsHeaderState {
  showPopover: boolean;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  DetailsHeaderDispatchProps &
  InjectedTranslateProps;

const reportType = OcpReportType.cost;

const baseQuery: OcpQuery = {
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

    let cost: string | number = '----';
    let derivedCost: string | number = '----';
    let infrastructureCost: string | number = '----';

    if (report && report.meta && report.meta.total) {
      cost = formatValue(
        report.meta.total.derived_cost ? report.meta.total.cost.value : 0,
        report.meta.total.derived_cost
          ? report.meta.total.derived_cost.units
          : 'USD'
      );
      derivedCost = formatValue(
        report.meta.total.derived_cost
          ? report.meta.total.derived_cost.value
          : 0,
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
          <Title className={css(styles.title)} size="2xl">
            {t('ocp_details.title')}
          </Title>
          {Boolean(showContent) && <GroupBy onItemClicked={onGroupByClicked} />}
        </div>
        {Boolean(showContent) && (
          <div className={css(styles.cost)}>
            <Title className={css(styles.costValue)} size="4xl">
              <Tooltip
                content={t('ocp_details.total_cost_tooltip', {
                  derivedCost,
                  infrastructureCost,
                })}
                enableFlip
              >
                <span>{cost}</span>
              </Tooltip>
            </Title>
            <div className={css(styles.costLabel)}>
              <div className={css(styles.costLabelUnit)}>
                {t('ocp_details.total_cost')}
                <Popover
                  enableFlip
                  bodyContent={
                    <>
                      <div>{t('ocp_details.derived_cost_title')}</div>
                      <div>{t('ocp_details.derived_cost_desc')}</div>
                      <div className={css(styles.infrastructureCost)}>
                        {t('ocp_details.infrastructure_cost_title')}
                      </div>
                      <div>{t('ocp_details.infrastructure_cost_desc')}</div>
                    </>
                  }
                >
                  <InfoCircleIcon
                    className={css(styles.info)}
                    onClick={this.handlePopoverClick}
                  />
                </Popover>
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
  const report = ocpReportsSelectors.selectReport(
    state,
    reportType,
    queryString
  );
  const reportError = ocpReportsSelectors.selectReportError(
    state,
    reportType,
    queryString
  );
  const reportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsHeader = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
