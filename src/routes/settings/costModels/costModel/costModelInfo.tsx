import { EmptyState, EmptyStateBody, Grid, GridItem, PageSection, TabContent } from '@patternfly/react-core';
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
              <EmptyState
                headingLevel="h2"
                icon={ErrorCircleOIcon}
                titleText={intl.formatMessage(messages.costModelsUUIDEmptyState)}
              >
                <EmptyStateBody>
                  {intl.formatMessage(messages.costModelsUUIDEmptyStateDesc, {
                    uuid: this.props.router.params.uuid,
                  })}
                </EmptyStateBody>
              </EmptyState>
            </>
          );
        }
      }
      return <NotAvailable title={intl.formatMessage(messages.costModels)} />;
    }

    const current = costModels[0];
    const sources = current.sources;
    return (
      <>
        <Header
          current={current}
          tabRefs={this.tabRefs}
          tabIndex={this.state.tabIndex}
          onSelectTab={tabIndex => this.setState({ tabIndex })}
        />
        <PageSection>
          {current.source_type === 'OpenShift Container Platform' ? (
            <>
              <TabContent eventKey={0} id="ref-price-list" ref={this.tabRefs[0]} hidden={this.state.tabIndex !== 0}>
                <PriceListTable assignees={sources.map(p => p.name)} costModel={current.name} current={current} />
              </TabContent>
              <TabContent
                eventKey={1}
                id="ref-cost-calculations"
                ref={this.tabRefs[1]}
                hidden={this.state.tabIndex !== 1}
              >
                <Grid hasGutter>
                  <GridItem lg={6} id="ref-markup">
                    <MarkupCard current={current} />
                  </GridItem>
                  <GridItem lg={6} id="ref-distribution">
                    <DistributionCard current={current} />
                  </GridItem>
                </Grid>
              </TabContent>
              <TabContent eventKey={3} id="ref-sources" ref={this.tabRefs[2]} hidden={this.state.tabIndex !== 2}>
                <SourceTable costModel={current} sources={sources} />
              </TabContent>
            </>
          ) : (
            <>
              <TabContent eventKey={0} id="ref-markup" ref={this.tabRefs[0]} hidden={this.state.tabIndex !== 0}>
                <MarkupCard current={current} />
              </TabContent>
              <TabContent eventKey={1} id="ref-sources" ref={this.tabRefs[1]} hidden={this.state.tabIndex !== 1}>
                <SourceTable costModel={current} sources={sources} />
              </TabContent>
            </>
          )}
        </PageSection>
      </>
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
