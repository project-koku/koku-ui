import { Flex, FlexItem } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { ResourcePathsType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { DateRange } from 'routes/components/dateRange';
import { GroupBy } from 'routes/components/groupBy';
import type { ComputedOcpReportItemsParams } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { DateRangeType, getCurrentDateRangeType } from 'routes/utils/dateRange';
import type { Filter } from 'routes/utils/filter';
import { filterProviders } from 'routes/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './efficiencyHeader.styles';
import { EfficiencyToolbar } from './efficiencyToolbar';

interface EfficiencyHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isDisabled?: boolean;
  isPreviousMonthData?: boolean;
  onCurrencySelect(value: string);
  onDateRangeSelect(value: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onGroupBySelect(value: string);
  query?: OcpQuery;
  resourcePathsType?: ResourcePathsType;
  timeScopeValue?: number;
}

interface EfficiencyHeaderStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString: string;
}

interface EfficiencyHeaderState {
  currentDateRangeType?: string;
}

type EfficiencyHeaderProps = EfficiencyHeaderOwnProps &
  EfficiencyHeaderStateProps &
  RouterComponentProps &
  WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'project', value: 'project' },
];

class EfficiencyHeaderBase extends React.Component<EfficiencyHeaderProps, EfficiencyHeaderState> {
  protected defaultState: EfficiencyHeaderState = {
    currentDateRangeType: DateRangeType.currentMonthToDate,
  };
  public state: EfficiencyHeaderState = { ...this.defaultState };

  public componentDidMount() {
    const { timeScopeValue } = this.props;

    this.setState({ currentDateRangeType: getCurrentDateRangeType(timeScopeValue) });
  }

  public componentDidUpdate(prevProps: EfficiencyHeaderProps) {
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

  private getToolbar = () => {
    const { groupBy, isDisabled, onFilterAdded, onFilterRemoved, query, resourcePathsType } = this.props;

    return (
      <EfficiencyToolbar
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        query={query}
        resourcePathsType={resourcePathsType}
      />
    );
  };

  public render() {
    const {
      currency,
      groupBy,
      isCurrentMonthData,
      isDisabled,
      isPreviousMonthData,
      onCurrencySelect,
      onGroupBySelect,
      timeScopeValue,
    } = this.props;
    const { currentDateRangeType } = this.state;

    return (
      <>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
          <FlexItem>
            <Flex>
              <FlexItem>
                <GroupBy
                  getIdKeyForGroupBy={getIdKeyForGroupBy}
                  groupBy={groupBy}
                  isDisabled={isDisabled}
                  onSelect={onGroupBySelect}
                  options={groupByOptions}
                  timeScopeValue={timeScopeValue}
                />
              </FlexItem>
              <FlexItem>
                <DateRange
                  dateRangeType={currentDateRangeType}
                  isCurrentMonthData={isCurrentMonthData}
                  isDisabled={isDisabled}
                  isPreviousMonthData={isPreviousMonthData}
                  onSelect={this.handleOnDateRangeSelect}
                />
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem style={styles.currencyContainer}>
            <Currency currency={currency} onSelect={onCurrencySelect} />
          </FlexItem>
        </Flex>
        <div style={styles.toolbarContainer}>{this.getToolbar()}</div>
      </>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<EfficiencyHeaderOwnProps, EfficiencyHeaderStateProps>((state, props) => {
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    providers: filterProviders(providers, ProviderType.ocp),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const EfficiencyHeader = injectIntl(withRouter(connect(mapStateToProps, {})(EfficiencyHeaderBase)));

export { EfficiencyHeader };
