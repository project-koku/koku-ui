import { Wizard } from '@patternfly/react-core';
import { CostModel } from 'api/costModels';
import { Provider } from 'api/providers';
import { parseApiError } from 'pages/createCostModelWizard/parseError';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsSelectors } from 'store/costModels';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';
import AddSourceStep from './addSourceStep';
import ReviewDetails from './review';

interface AddSourcesStepState {
  checked: { [uuid: string]: { selected: boolean; meta: Provider } };
}

interface Props extends InjectedTranslateProps {
  onClose: () => void;
  onSave: (sources_uuid: string[]) => void;
  isOpen: boolean;
  costModel: CostModel;
  fetch: typeof sourcesActions.fetchSources;
  providers: Provider[];
  isLoadingSources: boolean;
  isUpdateInProgress: boolean;
  fetchingSourcesError: string;
  query: { name: string; type: string; offset: string; limit: string };
  pagination: { page: number; perPage: number; count: number };
}

class AddSourceWizardBase extends React.Component<Props, AddSourcesStepState> {
  public state = { checked: {} };
  public componentDidMount() {
    const sourceType =
      this.props.costModel.source_type === 'OpenShift Container Platform'
        ? 'OCP'
        : 'AWS';
    this.props.fetch(`type=${sourceType}&limit=10&offset=0`);
  }
  public componentDidUpdate(prevProps) {
    if (
      prevProps.isLoadingSources === true &&
      this.props.isLoadingSources === false
    ) {
      const initChecked = this.props.providers.reduce((acc, curr) => {
        return {
          ...acc,
          [curr.uuid]: {
            selected: this.props.costModel.providers.some(
              p => p.uuid === curr.uuid
            ),
            meta: curr,
          },
        };
      }, {}) as { [uuid: string]: { selected: boolean; meta: Provider } };
      this.setState({ checked: initChecked });
    }
  }
  public render() {
    const {
      isUpdateInProgress,
      onClose,
      isOpen,
      onSave,
      t,
      costModel,
    } = this.props;
    const steps = [
      {
        id: 1,
        name: t('cost_models_wizard.steps.sources'),
        component: (
          <AddSourceStep
            fetch={this.props.fetch}
            fetchingSourcesError={this.props.fetchingSourcesError}
            isLoadingSources={this.props.isLoadingSources}
            providers={this.props.providers}
            pagination={this.props.pagination}
            query={this.props.query}
            costModel={costModel}
            checked={this.state.checked}
            setState={newState => {
              this.setState({ checked: newState });
            }}
          />
        ),
      },
      {
        id: 2,
        name: t('cost_models_wizard.steps.review'),
        component: (
          <ReviewDetails costModel={costModel} checked={this.state.checked} />
        ),
        nextButtonText: t('cost_models_wizard.finish_button'),
      },
    ];

    return (
      <Wizard
        isFullHeight
        isFullWidth
        isOpen={isOpen}
        title={t('cost_models_wizard.title')}
        description={t('cost_models_wizard.description')}
        steps={steps}
        onClose={onClose}
        footer={isUpdateInProgress ? <></> : undefined}
        onSave={() => {
          onSave(
            Object.keys(this.state.checked).filter(
              uuid => this.state.checked[uuid].selected
            )
          );
        }}
      />
    );
  }
}

export default connect(
  createMapStateToProps(state => {
    return {
      pagination: sourcesSelectors.pagination(state),
      query: sourcesSelectors.query(state),
      providers: sourcesSelectors.sources(state),
      isLoadingSources:
        sourcesSelectors.status(state) === FetchStatus.inProgress,
      isUpdateInProgress: costModelsSelectors.updateProcessing(state),
      fetchingSourcesError: sourcesSelectors.error(state)
        ? parseApiError(sourcesSelectors.error(state))
        : '',
    };
  }),
  {
    fetch: sourcesActions.fetchSources,
  }
)(translate()(AddSourceWizardBase));
