import { CostModel, CostModelProvider, CostModelRequest } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import AddSourceWizard from './addSourceWizard';
import Dialog from './dialog';
import Table from './table';

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
    const { intl, isDialogOpen, isLoading, setDialogOpen, sources, costModel } = this.props;

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
                  source_type: costModel.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
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
          title={intl.formatMessage(messages.CostModelsSourceDeleteSource)}
          onClose={() => {
            setDialogOpen({ name: 'deleteSource', isOpen: false });
            this.setState({ dialogSource: null });
          }}
          isProcessing={isLoading}
          onProceed={() => {
            const newState = {
              ...costModel,
              source_type: costModel.source_type === 'OpenShift Container Platform' ? 'OCP' : 'AWS',
              source_uuids: sources
                .filter(provider => provider.name !== this.state.dialogSource)
                .map(provider => provider.uuid),
            };
            this.props.updateCostModel(costModel.uuid, newState, 'deleteSource');
          }}
          body={
            <>
              {intl.formatMessage(messages.CostModelsSourceDeleteSourceDesc, {
                source: this.state.dialogSource,
                costModel: costModel.name,
              })}
            </>
          }
          actionText={intl.formatMessage(messages.CostModelsSourceDeleteSource)}
        />
        <Table
          onDeleteText={intl.formatMessage(messages.CostModelsSourceDelete)}
          onDelete={item => {
            this.setState({ dialogSource: item[0] });
            setDialogOpen({ name: 'deleteSource', isOpen: true });
          }}
          onAdd={() => setDialogOpen({ name: 'addSource', isOpen: true })}
          rows={sources.map(p => p.name)}
          current={costModel}
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
