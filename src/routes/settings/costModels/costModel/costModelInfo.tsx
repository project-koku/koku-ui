import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Grid,
  GridItem,
  PageSection,
  TabContent,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/error-circle-o-icon';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import type { CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Loading } from 'routes/components/page/loading';
import { NotAvailable } from 'routes/components/page/notAvailable';
import DistributionCard from 'routes/settings/costModels/costModel/distribution';
import MarkupCard from 'routes/settings/costModels/costModel/markup';
import PriceListTable from 'routes/settings/costModels/costModel/priceListTable';
import SourceTable from 'routes/settings/costModels/costModel/sourceTable';
import { parseApiError } from 'routes/settings/costModels/costModelWizard/parseError';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsActions, metricsSelectors } from 'store/metrics';
import { rbacActions, rbacSelectors } from 'store/rbac';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './costModelInfo.styles';
import Header from './header';

interface CostModelInfoOwnProps {
  costModels: CostModel[];
  costModelStatus: FetchStatus;
  costModelError: AxiosError;
  distribution: { value: string };
  fetchMetrics: typeof metricsActions.fetchMetrics;
  markup: { value: string };
  metricsStatus: FetchStatus;
  metricsError: AxiosError;
  fetchRbac: typeof rbacActions.fetchRbac;
  rbacStatus: FetchStatus;
  rbacError: Error;
  fetchCostModels: typeof costModelsActions.fetchCostModels;
}

type CostModelInfoProps = CostModelInfoOwnProps & RouterComponentProps & WrappedComponentProps;

interface CostModelInfoState {
  tabIndex: number;
}

class CostModelInfo extends React.Component<CostModelInfoProps, CostModelInfoState> {
  public tabRefs = [React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>()];
  constructor(props) {
    super(props);
    this.state = { tabIndex: 0 };
  }

  public componentDidMount() {
    this.props.fetchRbac();
    this.props.fetchMetrics();
    this.props.fetchCostModels(`uuid=${this.props.router.params.uuid}`);
  }

  public render() {
    const { costModels, costModelError, costModelStatus, intl, metricsError, metricsStatus, rbacError, rbacStatus } =
      this.props;

    if (
      metricsStatus !== FetchStatus.complete ||
      rbacStatus !== FetchStatus.complete ||
      costModelStatus !== FetchStatus.complete
    ) {
      return <Loading title={intl.formatMessage(messages.costModels)} />;
    }

    const fetchError = metricsError || rbacError || costModelError;
    if (fetchError) {
      if (costModelError !== null) {
        const costModelErrMessage = parseApiError(costModelError);
        if (costModelErrMessage === 'detail: Invalid provider uuid') {
          return (
            <>
              <PageHeader>
                <PageHeaderTitle title={intl.formatMessage(messages.costModels)} />
              </PageHeader>
              <PageSection>
                <EmptyState>
                  <EmptyStateHeader
                    titleText={<>{intl.formatMessage(messages.costModelsUUIDEmptyState)}</>}
                    icon={<EmptyStateIcon icon={ErrorCircleOIcon} />}
                    headingLevel="h2"
                  />
                  <EmptyStateBody>
                    {intl.formatMessage(messages.costModelsUUIDEmptyStateDesc, {
                      uuid: this.props.router.params.uuid,
                    })}
                  </EmptyStateBody>
                </EmptyState>
              </PageSection>
            </>
          );
        }
      }
      return <NotAvailable title={intl.formatMessage(messages.costModels)} />;
    }

    const current = costModels[0];
    const sources = current.sources;
    return (
      <div>
        <Header
          current={current}
          tabRefs={this.tabRefs}
          tabIndex={this.state.tabIndex}
          onSelectTab={tabIndex => this.setState({ tabIndex })}
        />
        <div style={styles.content}>
          {current.source_type === 'OpenShift Container Platform' ? (
            <>
              <TabContent eventKey={0} id="refPriceList" ref={this.tabRefs[0]} hidden={this.state.tabIndex !== 0}>
                <div style={styles.costmodelsContainer}>
                  <PriceListTable assignees={sources.map(p => p.name)} costModel={current.name} current={current} />
                </div>
              </TabContent>
              <TabContent
                eventKey={1}
                id="refCostCalculations"
                ref={this.tabRefs[1]}
                hidden={this.state.tabIndex !== 1}
              >
                <div style={styles.costCalculation}>
                  <Grid hasGutter>
                    <GridItem lg={6} id="refMarkup">
                      <MarkupCard current={current} />
                    </GridItem>
                    <GridItem lg={6} id="refDistribution">
                      <DistributionCard current={current} />
                    </GridItem>
                  </Grid>
                </div>
              </TabContent>
              <TabContent eventKey={3} id="refSources" ref={this.tabRefs[2]} hidden={this.state.tabIndex !== 2}>
                <div style={styles.costmodelsContainer}>
                  <SourceTable costModel={current} sources={sources} />
                </div>
              </TabContent>
            </>
          ) : (
            <>
              <TabContent eventKey={0} id="refMarkup" ref={this.tabRefs[0]} hidden={this.state.tabIndex !== 0}>
                <div style={styles.costCalculation}>
                  <MarkupCard current={current} />
                </div>
              </TabContent>
              <TabContent eventKey={1} id="refSources" ref={this.tabRefs[1]} hidden={this.state.tabIndex !== 1}>
                <div style={styles.costmodelsContainer}>
                  <SourceTable costModel={current} sources={sources} />
                </div>
              </TabContent>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(
  withRouter(
    connect(
      createMapStateToProps(store => {
        return {
          costModels: costModelsSelectors.costModels(store),
          costModelError: costModelsSelectors.error(store),
          costModelStatus: costModelsSelectors.status(store),
          metricsHash: metricsSelectors.metrics(store),
          maxRate: metricsSelectors.maxRate(store),
          costTypes: metricsSelectors.costTypes(store),
          metricsError: metricsSelectors.metricsState(store).error,
          metricsStatus: metricsSelectors.status(store),
          rbacError: rbacSelectors.selectRbacState(store).error,
          rbacStatus: rbacSelectors.selectRbacState(store).status,
        };
      }),
      {
        fetchMetrics: metricsActions.fetchMetrics,
        fetchRbac: rbacActions.fetchRbac,
        fetchCostModels: costModelsActions.fetchCostModels,
      }
    )(CostModelInfo)
  )
);
