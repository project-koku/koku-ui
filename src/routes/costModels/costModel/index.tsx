import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Grid,
  GridItem,
  TabContent,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/esm/icons/error-circle-o-icon';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader, { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import type { CostModel } from 'api/costModels';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { RouteComponentProps } from 'react-router-dom';
import DistributionCard from 'routes/costModels/costModel/distribution';
import MarkupCard from 'routes/costModels/costModel/markup';
import PriceListTable from 'routes/costModels/costModel/priceListTable';
import SourceTable from 'routes/costModels/costModel/sourceTable';
import { parseApiError } from 'routes/costModels/createCostModelWizard/parseError';
import { Loading } from 'routes/state/loading';
import { NotAvailable } from 'routes/state/notAvailable';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsActions, metricsSelectors } from 'store/metrics';
import { rbacActions, rbacSelectors } from 'store/rbac';

import { styles } from './costModelInfo.styles';
import Header from './header';

interface OwnProps {
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

type Props = OwnProps & RouteComponentProps<{ uuid: string }> & WrappedComponentProps;

interface State {
  tabIndex: number;
}

class CostModelInformation extends React.Component<Props, State> {
  public tabRefs = [React.createRef<HTMLElement>(), React.createRef<HTMLElement>(), React.createRef<HTMLElement>()];
  constructor(props) {
    super(props);
    this.state = { tabIndex: 0 };
  }

  public componentDidMount() {
    this.props.fetchRbac();
    this.props.fetchMetrics();
    this.props.fetchCostModels(`uuid=${this.props.match.params.uuid}`);
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
              <Main>
                <EmptyState>
                  <EmptyStateIcon icon={ErrorCircleOIcon} />
                  <Title headingLevel="h2" size={TitleSizes.lg}>
                    {intl.formatMessage(messages.costModelsUUIDEmptyState)}
                  </Title>
                  <EmptyStateBody>
                    {intl.formatMessage(messages.costModelsUUIDEmptyStateDesc, {
                      uuid: this.props.match.params.uuid,
                    })}
                  </EmptyStateBody>
                </EmptyState>
              </Main>
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
          historyObject={this.props.history}
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
  )(CostModelInformation)
);
