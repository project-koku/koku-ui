import { EmptyState, EmptyStateBody, EmptyStateIcon, TabContent, Title } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons/dist/js/icons/error-circle-o-icon';
import { Main } from '@redhat-cloud-services/frontend-components/components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/components/PageHeader';
import { CostModel } from 'api/costModels';
import { AxiosError } from 'axios';
import MarkupCard from 'pages/costModels/costModelsDetails/components/markup';
import PriceListTable from 'pages/costModels/costModelsDetails/components/priceListTable';
import SourceTable from 'pages/costModels/costModelsDetails/sourceTable';
import { parseApiError } from 'pages/costModels/createCostModelWizard/parseError';
import Loading from 'pages/state/loading';
import NotAvailable from 'pages/state/notAvailable';
import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsActions, metricsSelectors } from 'store/metrics';
import { rbacActions, rbacSelectors } from 'store/rbac';

import { styles } from './costModelInfo.styles';
import Header from './header';

interface OwnProps {
  markup: { value: string };
  costModels: CostModel[];
  costModelStatus: FetchStatus;
  costModelError: AxiosError;
  fetchMetrics: typeof metricsActions.fetchMetrics;
  metricsStatus: FetchStatus;
  metricsError: AxiosError;
  fetchRbac: typeof rbacActions.fetchRbac;
  rbacStatus: FetchStatus;
  rbacError: Error;
  fetchCostModels: typeof costModelsActions.fetchCostModels;
}

type Props = OwnProps & RouteComponentProps<{ uuid: string }>;

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
    const {
      costModels,
      metricsStatus,
      rbacStatus,
      costModelStatus,
      rbacError,
      costModelError,
      metricsError,
    } = this.props;
    if (
      metricsStatus !== FetchStatus.complete ||
      rbacStatus !== FetchStatus.complete ||
      costModelStatus !== FetchStatus.complete
    ) {
      return <Translation>{t => <Loading title={t('cost_models_details.header.title')} />}</Translation>;
    }
    const fetchError = metricsError || rbacError || costModelError;
    if (fetchError) {
      if (costModelError !== null) {
        const costModelErrMessage = parseApiError(costModelError);
        if (costModelErrMessage === 'detail: Invalid provider uuid') {
          return (
            <Translation>
              {t => {
                return (
                  <>
                    <PageHeader>
                      <PageHeaderTitle title={t('cost_models_details.header.title')} />
                    </PageHeader>
                    <Main>
                      <EmptyState>
                        <EmptyStateIcon icon={ErrorCircleOIcon} />
                        <Title headingLevel="h2" size="lg">
                          {t('cost_models_details.empty_state_bad_uuid.title')}
                        </Title>
                        <EmptyStateBody>
                          {t('cost_models_details.empty_state_bad_uuid.description', {
                            uuid: this.props.match.params.uuid,
                          })}
                        </EmptyStateBody>
                      </EmptyState>
                    </Main>
                  </>
                );
              }}
            </Translation>
          );
        }
      }
      return <Translation>{t => <NotAvailable title={t('cost_models_details.header.title')} />}</Translation>;
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
                  <PriceListTable costModel={current.name} assignees={sources.map(p => p.name)} current={current} />
                </div>
              </TabContent>
              <TabContent eventKey={1} id="refMarkup" ref={this.tabRefs[1]} hidden={this.state.tabIndex !== 1}>
                <MarkupCard current={current} />
              </TabContent>
              <TabContent eventKey={2} id="refSources" ref={this.tabRefs[2]} hidden={this.state.tabIndex !== 2}>
                <div style={styles.costmodelsContainer}>
                  <SourceTable costModel={current} sources={sources} />
                </div>
              </TabContent>
            </>
          ) : (
            <>
              <TabContent eventKey={0} id="refMarkup" ref={this.tabRefs[0]} hidden={this.state.tabIndex !== 0}>
                <MarkupCard current={current} />
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

export default connect(
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
)(CostModelInformation);
