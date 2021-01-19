import { Button, ButtonVariant, Popover, Title, Tooltip } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { OcpReport } from 'api/reports/ocpReports';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import { GroupBy } from 'pages/details/components/groupBy/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { ComputedOcpReportItemsParams, getIdKeyForGroupBy } from 'utils/computedReport/getComputedOcpReportItems';
import { getSinceDateRangeString } from 'utils/dateRange';
import { formatValue } from 'utils/formatValue';

import { styles } from './detailsHeader.styles';

interface DetailsHeaderOwnProps {
  groupBy?: string;
  onGroupByClicked(value: string);
  report: OcpReport;
}

interface DetailsHeaderStateProps {
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  queryString: string;
}

interface DetailsHeaderState {}

type DetailsHeaderProps = DetailsHeaderOwnProps & DetailsHeaderStateProps & WithTranslation;

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

const tagReportPathsType = TagPathsType.ocp;

class DetailsHeaderBase extends React.Component<DetailsHeaderProps> {
  protected defaultState: DetailsHeaderState = {};
  public state: DetailsHeaderState = { ...this.defaultState };

  public render() {
    const { groupBy, onGroupByClicked, providers, providersError, report, t } = this.props;
    const showContent = report && !providersError && providers && providers.meta && providers.meta.count > 0;

    let cost: string | React.ReactNode = <EmptyValueState />;
    let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
    let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

    if (report && report.meta && report.meta.total) {
      const hasCost = report.meta.total.cost && report.meta.total.cost.total;
      const hasSupplementaryCost = report.meta.total.supplementary && report.meta.total.supplementary.total;
      const hasInfrastructureCost = report.meta.total.infrastructure && report.meta.total.infrastructure.total;
      cost = formatValue(
        hasCost ? report.meta.total.cost.total.value : 0,
        hasCost ? report.meta.total.cost.total.units : 'USD'
      );
      supplementaryCost = formatValue(
        hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
        hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD'
      );
      infrastructureCost = formatValue(
        hasInfrastructureCost ? report.meta.total.infrastructure.total.value : 0,
        hasInfrastructureCost ? report.meta.total.infrastructure.total.units : 'USD'
      );
    }

    return (
      <header style={styles.header}>
        <div>
          <Title headingLevel="h2" style={styles.title} size="2xl">
            {t('ocp_details.title')}
          </Title>
          <GroupBy
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={!showContent}
            onItemClicked={onGroupByClicked}
            options={groupByOptions}
            showTags
            tagReportPathsType={tagReportPathsType}
          />
        </div>
        {Boolean(showContent) && (
          <div style={styles.cost}>
            <Title headingLevel="h2" style={styles.costValue} size="4xl">
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
                    aria-label={t('ocp_details.supplementary_aria_label')}
                    enableFlip
                    bodyContent={
                      <>
                        <p style={styles.infoTitle}>{t('ocp_details.supplementary_cost_title')}</p>
                        <p>{t('ocp_details.supplementary_cost_desc')}</p>
                        <br />
                        <p style={styles.infoTitle}>{t('ocp_details.infrastructure_cost_title')}</p>
                        <p>{t('ocp_details.infrastructure_cost_desc')}</p>
                      </>
                    }
                  >
                    <Button variant={ButtonVariant.plain}>
                      <OutlinedQuestionCircleIcon style={styles.info} />
                    </Button>
                  </Popover>
                </span>
              </div>
              <div style={styles.costLabelDate}>{getSinceDateRangeString()}</div>
            </div>
          </div>
        )}
      </header>
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<DetailsHeaderOwnProps, DetailsHeaderStateProps>((state, props) => {
  const queryString = getQuery(baseQuery);
  const providersQueryString = getProvidersQuery(ocpProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ocp, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.ocp, providersQueryString);
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

const DetailsHeader = withTranslation()(connect(mapStateToProps, {})(DetailsHeaderBase));

export { DetailsHeader, DetailsHeaderProps };
