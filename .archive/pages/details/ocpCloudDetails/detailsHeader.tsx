import { Popover, Title, Tooltip } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OcpCloudReport } from 'api/reports/ocpCloudReports';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { GroupBy } from 'routes/details/components/groupBy/groupBy';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
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
  report: OcpCloudReport;
}

interface DetailsHeaderStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString: string;
}

interface DetailsHeaderState {
  showPopover: boolean;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  InjectedTranslateProps;

const baseQuery: OcpCloudQuery = {
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

const reportPathsType = ReportPathsType.ocpCloud;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  protected defaultState: DetailsHeaderState = {
    showPopover: false,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

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
      t,
    } = this.props;
    const showContent =
      report &&
      !providersError &&
      providers &&
      providers.meta &&
      providers.meta.count > 0;

    let cost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report && report.meta && report.meta.total) {
      const hasCost = report.meta.total.cost && report.meta.total.cost.total;
      const hasInfrastructureCost =
        report.meta.total.infrastructure &&
        report.meta.total.infrastructure.total;
      cost = formatValue(
        hasCost ? report.meta.total.cost.total.value : 0,
        hasCost ? report.meta.total.cost.total.units : 'USD'
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
          <Title headingLevel="h2" style={styles.title} size="xl">
            {t('ocp_cloud_details.title')}
          </Title>
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
              <Tooltip
                content={t('ocp_cloud_details.total_cost_tooltip', {
                  infrastructureCost,
                })}
                enableFlip
              >
                <span>{cost}</span>
              </Tooltip>
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>
                {t('ocp_cloud_details.total_cost')}
                <span style={styles.infoIcon}>
                  <Popover
                    aria-label={t('ocp_cloud_details.markup_aria_label')}
                    enableFlip
                    bodyContent={
                      <>
                        <p style={styles.infoTitle}>
                          {t('ocp_cloud_details.infrastructure_cost_title')}
                        </p>
                        <p>{t('ocp_cloud_details.infrastructure_cost_desc')}</p>
                      </>
                    }
                  >
                    <QuestionCircleIcon
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
  };
});

const DetailsHeader = translate()(
  connect(mapStateToProps, {})(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
