import { Flex, FlexItem, Title, TitleSizes } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { IbmReport } from 'api/reports/ibmReports';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import { ExportsLink } from 'components/drawers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Currency } from 'routes/components/currency';
import { GroupBy } from 'routes/components/groupBy';
import type { ComputedIbmReportItemsParams } from 'routes/utils/computedReport/getComputedIbmReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedIbmReportItems';
import { filterProviders } from 'routes/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { getSinceDateRangeString } from 'utils/dates';
import { formatCurrency } from 'utils/format';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  onCurrencySelect(value: string);
  onGroupBySelect(value: string);
  report: IbmReport;
}

interface DetailsHeaderStateProps {
  isExportsToggleEnabled?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  providersQueryString?: string;
}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WrappedComponentProps;

const groupByOptions: {
  label: string;
  value: ComputedIbmReportItemsParams['idKey'];
}[] = [
  { label: 'account', value: 'account' },
  { label: 'project', value: 'project' },
  { label: 'service', value: 'service' },
  { label: 'region', value: 'region' },
];

const tagPathsType = TagPathsType.ibm;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps, any> {
  public render() {
    const {
      currency,
      groupBy,
      isExportsToggleEnabled,
      onCurrencySelect,
      onGroupBySelect,
      providers,
      providersError,
      report,
      intl,
    } = this.props;
    const showContent = report && !providersError && providers?.meta?.count > 0;

    const hasCost = report?.meta?.total?.cost?.total;

    return (
      <header>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
              {intl.formatMessage(messages.ibmDetailsTitle)}
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
              <FlexItem style={styles.perspective}>
                <div style={styles.groupBy}>
                  <GroupBy
                    getIdKeyForGroupBy={getIdKeyForGroupBy}
                    groupBy={groupBy}
                    isDisabled={!showContent}
                    onSelect={onGroupBySelect}
                    options={groupByOptions}
                    showTags
                    tagPathsType={tagPathsType}
                  />
                </div>
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
                <div style={styles.dateTitle}>{getSinceDateRangeString()}</div>
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
    providers: filterProviders(providers, ProviderType.ibm),
    providersError,
    providersFetchStatus,
    providersQueryString,
  };
});

const DetailsHeader = injectIntl(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader };
export type { DetailsHeaderProps };
