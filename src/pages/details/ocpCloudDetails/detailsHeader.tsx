import { Popover, Title, TitleSize, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpCloudQuery } from 'api/queries/ocpCloudQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OcpCloudReport } from 'api/reports/ocpCloudReports';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import React from 'react';
import {
  FormattedMessage,
  injectIntl,
  WrappedComponentProps,
} from 'react-intl';
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
  WrappedComponentProps;

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
      intl,
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
          <Title style={styles.title} size={TitleSize['2xl']}>
            {intl.formatMessage({ id: 'ocp_cloud_details.title' })}
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
            <Title style={styles.costValue} size="4xl">
              <Tooltip
                content={
                  <FormattedMessage
                    id="ocp_cloud_details.total_cost_tooltip"
                    values={{
                      infrastructureCost,
                    }}
                  />
                }
                enableFlip
              >
                <span>{cost}</span>
              </Tooltip>
            </Title>
            <div style={styles.costLabel}>
              <div style={styles.costLabelUnit}>
                {intl.formatMessage({ id: 'ocp_cloud_details.total_cost' })}
                <span style={styles.infoIcon}>
                  <Popover
                    aria-label={intl.formatMessage({
                      id: 'ocp_cloud_details.markup_aria_label',
                    })}
                    enableFlip
                    bodyContent={
                      <>
                        <p style={styles.infoTitle}>
                          {intl.formatMessage({
                            id: 'ocp_cloud_details.infrastructure_cost_title',
                          })}
                        </p>
                        <p>
                          {intl.formatMessage({
                            id: 'ocp_cloud_details.infrastructure_cost_desc',
                          })}
                        </p>
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

const DetailsHeader = injectIntl(
  connect(mapStateToProps, {})(DetailsHeaderBase)
);

export { DetailsHeader, DetailsHeaderProps };
