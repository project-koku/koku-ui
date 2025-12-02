import type { Providers } from '@koku-ui/api/providers';
import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { Query } from '@koku-ui/api/queries/query';
import type { GcpReport } from '@koku-ui/api/reports/gcpReports';
import { TagPathsType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { ExportsLink } from '../../../components/drawers';
import type { FetchStatus } from '../../../store/common';
import { createMapStateToProps } from '../../../store/common';
import { FeatureToggleSelectors } from '../../../store/featureToggle';
import { providersQuery, providersSelectors } from '../../../store/providers';
import { getSinceDateRangeString } from '../../../utils/dates';
import { formatCurrency } from '../../../utils/format';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { Currency } from '../../components/currency';
import { DateRange } from '../../components/dateRange';
import { GroupBy } from '../../components/groupBy';
import type { ComputedGcpReportItemsParams } from '../../utils/computedReport/getComputedGcpReportItems';
import { getIdKeyForGroupBy } from '../../utils/computedReport/getComputedGcpReportItems';
import { DateRangeType, getCurrentDateRangeType } from '../../utils/dateRange';
import { filterProviders } from '../../utils/providers';
import { ProviderDetailsModal } from '../components/providerStatus';
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
  report: GcpReport;
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
  value: ComputedGcpReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'gcp_project', value: 'gcp_project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const tagPathsType = TagPathsType.gcp;

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
              {intl.formatMessage(messages.gcpDetailsTitle)}
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
                <ProviderDetailsModal providerType={ProviderType.gcp} />
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
    providers: filterProviders(providers, ProviderType.gcp),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(withRouter(connect(mapStateToProps, {})(DetailsHeaderBase)));

export { DetailsHeader };
export type { DetailsHeaderProps };
