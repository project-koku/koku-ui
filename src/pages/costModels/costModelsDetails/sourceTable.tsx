import { CostModel, CostModelProvider, CostModelRequest } from 'api/costModels';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import AddSourceWizard from './addSourceWizard';
import Dialog from './components/dialog';
import Table from './components/table';

interface Props extends WrappedComponentProps {
  updateCostModel: typeof costModelsActions.updateCostModel;
  costModel: CostModel;
  sources: CostModelProvider[];
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
      sources,
      costModel,
      intl,
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
                  source_uuids,
                } as CostModelRequest,
                'addSource'
              );
            }}
          />
        )}
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteSource}
          title={intl.formatMessage(
            { id: 'dialog.delete_source_from_cost_model_title' },
            {
              source: this.state.dialogSource,
              cost_model: costModel.name,
            }
          )}
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
              source_uuids: sources
                .filter(provider => provider.name !== this.state.dialogSource)
                .map(provider => provider.uuid),
            };
            this.props.updateCostModel(
              costModel.uuid,
              newState,
              'deleteSource'
            );
          }}
          body={
            <>
              {intl.formatMessage(
                { id: 'dialog.delete_source_from_cost_model_body' },
                {
                  source: this.state.dialogSource,
                  cost_model: costModel.name,
                }
              )}
            </>
          }
          actionText={intl.formatMessage({ id: 'dialog.deleteSource' })}
        />
        <Table
          onDeleteText={intl.formatMessage({
            id: 'cost_models_details.action_unassign',
          })}
          onDelete={item => {
            this.setState({ dialogSource: item[0] });
            setDialogOpen({ name: 'deleteSource', isOpen: true });
          }}
          onAdd={() => setDialogOpen({ name: 'addSource', isOpen: true })}
          cells={[intl.formatMessage({ id: 'filter.name' })]}
          rows={sources.map(p => p.name)}
        />
      </>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => ({
      isLoading: costModelsSelectors.updateProcessing(state),
      isDialogOpen: costModelsSelectors.isDialogOpen(state)('sources'),
    })),
    {
      setDialogOpen: costModelsActions.setCostModelDialog,
      updateCostModel: costModelsActions.updateCostModel,
    }
  )(SourceTableBase)
);
