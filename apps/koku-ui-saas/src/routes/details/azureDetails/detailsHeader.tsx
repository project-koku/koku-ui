import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import type { AzureReport } from 'api/reports/azureReports';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { DateRange } from 'routes/components/dateRange';
import { GroupBy } from 'routes/components/groupBy';
import { ProviderDetailsModal } from 'routes/details/components/providerStatus';
import type { ComputedAzureReportItemsParams } from 'routes/utils/computedReport/getComputedAzureReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedAzureReportItems';
import { DateRangeType, getCurrentDateRangeType } from 'routes/utils/dateRange';
import { filterProviders } from 'routes/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  onCurrencySelect(value: string);
  onDateRangeSelect(value: string);
  onGroupBySelect(value: string);
  query?: Query;
  report: AzureReport;
  timeScopeValue?: number;
}

interface DetailsHeaderStateProps {
  isExportsToggleEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString?: string;
}

interface DetailsHeaderState {
  currentDateRangeType?: string;
}

type DetailsHeaderProps = DetailsHeaderOwnProps &
  DetailsHeaderStateProps &
  RouterComponentProps &
  WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedAzureReportItemsParams['idKey'];
}[] = [
  { label: 'subscription_guid', value: 'subscription_guid' },
  { label: 'service_name', value: 'service_name' },
  { label: 'resource_location', value: 'resource_location' },
];

const tagPathsType = TagPathsType.azure;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps, any> {
  protected defaultState: DetailsHeaderState = {
    currentDateRangeType: DateRangeType.currentMonthToDate,
  };
  public state: DetailsHeaderState = { ...this.defaultState };

  public componentDidMount() {
    const { timeScopeValue } = this.props;

    this.setState({ currentDateRangeType: getCurrentDateRangeType(timeScopeValue) });
  }

  public componentDidUpdate(prevProps: DetailsHeaderProps) {
    const { timeScopeValue } = this.props;

    if (prevProps.timeScopeValue !== timeScopeValue) {
      this.setState({ currentDateRangeType: getCurrentDateRangeType(timeScopeValue) });
    }
  }

  private handleOnDateRangeSelect = (value: string) => {
    const { onDateRangeSelect } = this.props;

    this.setState({ currentDateRangeType: value }, () => {
      if (onDateRangeSelect) {
        onDateRangeSelect(value);
      }
    });
  };

  public render() {
    const {
      currency,
      groupBy,
      intl,
      isCurrentMonthData,
      isExportsToggleEnabled,
      isPreviousMonthData,
      onCurrencySelect,
      onGroupBySelect,
      providers,
      providersError,
      report,
      timeScopeValue,
    } = this.props;
    const { currentDateRangeType } = this.state;

    const showContent = report && !providersError && providers?.meta?.count > 0;
    const hasCost = report?.meta?.total?.cost?.total;

    return (
      <header>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.azureDetailsTitle)}
            </Title>
          </FlexItem>
          <FlexItem style={styles.exportContainer}>
            <Currency currency={currency} onSelect={onCurrencySelect} />
            {isExportsToggleEnabled && <ExportsLink />}
          </FlexItem>
        </Flex>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            <Flex>
              <FlexItem style={styles.status}>
                <ProviderDetailsModal providerType={ProviderType.azure} />
              </FlexItem>
            </Flex>
            <Flex>
              <FlexItem>
                <GroupBy
                  getIdKeyForGroupBy={getIdKeyForGroupBy}
                  groupBy={groupBy}
                  isDisabled={!showContent}
                  onSelect={onGroupBySelect}
                  options={groupByOptions}
                  showTags
                  tagPathsType={tagPathsType}
                  timeScopeValue={timeScopeValue}
                />
              </FlexItem>
              <FlexItem>
                <DateRange
                  dateRangeType={currentDateRangeType}
                  isCurrentMonthData={isCurrentMonthData}
                  isDisabled={!showContent}
                  isPreviousMonthData={isPreviousMonthData}
                  onSelect={this.handleOnDateRangeSelect}
                />
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            {showContent && (
              <>
                <Title headingLevel="h2" style={styles.costValue} size={TitleSizes['4xl']}>
                  {formatCurrency(
                    hasCost ? report.meta.total.cost.total.value : 0,
                    hasCost ? report.meta.total.cost.total.units : 'USD'
                  )}
                </Title>
                <div style={styles.dateTitle}>
                  {getSinceDateRangeString(undefined, timeScopeValue === -2 ? 1 : 0, true)}
                </div>
              </>
            )}
          </FlexItem>
        </Flex>
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsHeaderOwnProps, DetailsHeaderStateProps>((state, props) => {
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
    providers: filterProviders(providers, ProviderType.azure),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(withRouter(connect(mapStateToProps, {})(DetailsHeaderBase)));

export { DetailsHeader };
export type { DetailsHeaderProps };
