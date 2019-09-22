import { CostModel } from 'api/costModels';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import Dialog from './dialog';

interface Props extends InjectedTranslateProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: typeof costModelsActions.setCostModelDialog;
  updateCostModel: typeof costModelsActions.updateCostModel;
  current: CostModel;
  error: string;
}

const DeleteMarkupDialog: React.SFC<Props> = ({
  t,
  isOpen,
  isLoading,
  onClose,
  updateCostModel,
  current,
  error,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      title={t('dialog.markup.title', { cost_model: current.name })}
      onClose={() => onClose({ isOpen: false, name: 'deleteMarkup' })}
      isProcessing={isLoading}
      onProceed={() => {
        const newState = {
          ...current,
          provider_uuids: current.providers.map(provider => provider.uuid),
          source_type:
            current.source_type === 'OpenShift Container Platform'
              ? 'OCP'
              : 'AWS',
          markup: { value: '0', unit: 'percent' },
        };
        updateCostModel(current.uuid, newState, 'deleteMarkup');
      }}
      body={<>{t('dialog.markup.body', { cost_model: current.name })}</>}
      actionText={t('dialog.deleteMarkup')}
      error={error}
    />
  );
};

export default connect(
  createMapStateToProps(state => {
    const { deleteMarkup } = costModelsSelectors.isDialogOpen(state)('markup');
    return {
      isOpen: deleteMarkup,
      isLoading: costModelsSelectors.updateProcessing(state),
      error: costModelsSelectors.updateError(state),
      current: costModelsSelectors.selected(state),
    };
  }),
  {
    onClose: costModelsActions.setCostModelDialog,
    updateCostModel: costModelsActions.updateCostModel,
  }
)(translate()(DeleteMarkupDialog));
