import { CostModel, CostModelProvider, CostModelRequest } from 'api/costModels';
import AddSourceWizard from 'pages/costModelsDetails/addSourceWizard';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import Dialog from './dialog';
import Table from './table';

interface Props extends InjectedTranslateProps {
  updateCostModel: typeof costModelsActions.updateCostModel;
  costModel: CostModel;
  providers: CostModelProvider[];
  isLoading: boolean;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  isDialogOpen: { deleteSource: boolean; addSource: boolean };
}

interface State {
  dialogSource: string;
}

class SourceTableBase extends React.Component<Props, State> {
  public state = { dialogSource: null };
  public render() {
    const {
      setDialogOpen,
      isLoading,
      providers,
      costModel,
      t,
      isDialogOpen,
    } = this.props;
    return (
      <>
        {isDialogOpen.addSource && (
          <AddSourceWizard
            costModel={costModel}
            isOpen
            onClose={() => setDialogOpen({ name: 'addSource', isOpen: false })}
            onSave={(source_uuids: string[]) => {
              this.props.updateCostModel(
                costModel.uuid,
                {
                  ...costModel,
                  source_type:
                    costModel.source_type === 'OpenShift Container Platform'
                      ? 'OCP'
                      : 'AWS',
                  provider_uuids: source_uuids,
                } as CostModelRequest,
                'addSource'
              );
            }}
          />
        )}
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteSource}
          title={t('dialog.delete_source_from_cost_model_title', {
            source: this.state.dialogSource,
            cost_model: costModel.name,
          })}
          onClose={() => {
            setDialogOpen({ name: 'deleteSource', isOpen: false });
            this.setState({ dialogSource: null });
          }}
          isProcessing={isLoading}
          onProceed={() => {
            const newState = {
              ...costModel,
              source_type:
                costModel.source_type === 'OpenShift Container Platform'
                  ? 'OCP'
                  : 'AWS',
              provider_uuids: providers
                .filter(provider => provider.name !== this.state.dialogSource)
                .map(provider => provider.uuid),
            };
            this.props.updateCostModel(
              costModel.uuid,
              newState,
              'deleteSource'
            );
          }}
          body={t('dialog.delete_source_from_cost_model_body', {
            source: this.state.dialogSource,
            cost_model: costModel.name,
          })}
          actionText={t('dialog.deleteSource')}
        />
        <Table
          onDeleteText={t('cost_models_details.action_unassign')}
          onDelete={item => {
            this.setState({ dialogSource: item[0] });
            setDialogOpen({ name: 'deleteSource', isOpen: true });
          }}
          onAdd={() => setDialogOpen({ name: 'addSource', isOpen: true })}
          cells={[t('filter.name')]}
          rows={providers.map(p => p.name)}
        />
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isLoading: costModelsSelectors.updateProcessing(state),
    isDialogOpen: costModelsSelectors.isDialogOpen(state)('sources'),
  })),
  {
    setDialogOpen: costModelsActions.setCostModelDialog,
    updateCostModel: costModelsActions.updateCostModel,
  }
)(translate()(SourceTableBase));
