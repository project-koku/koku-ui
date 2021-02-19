import { Modal, ModalProps, ModalVariant } from '@patternfly/react-core';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'store';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { DeleteDialogActions, DeleteDialogBody, getDialogStateName } from './utils/dialog';

const mapStateToProps = (state: RootState) => {
  return {
    isOpen: costModelsSelectors.isDialogOpen(state)('costmodel').deleteCostModel,
    isLoading: costModelsSelectors.deleteProcessing(state),
    deleteError: costModelsSelectors.deleteError(state),
    dialogData: costModelsSelectors.dialogData(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    closeDialog: () => dispatch(costModelsActions.setCostModelDialog({ name: 'deleteCostModel', isOpen: false })),
    deleteCostModel: (uuid: string) => costModelsActions.deleteCostModel(uuid, 'deleteCostModel')(dispatch),
  };
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>,
  ownProps: WithTranslation
) => {
  const { t } = ownProps;
  const stateName = getDialogStateName(stateProps.isLoading, stateProps.isOpen, stateProps.deleteError);
  const data = stateProps.dialogData && stateProps.dialogData.costModel ? stateProps.dialogData.costModel : null;
  const name = data ? data.name : '';
  const sources = data ? data.sources.map(source => source.name) : [];
  const uuid = data ? data.uuid : '';

  const actions = DeleteDialogActions({
    status: stateName,
    deleteText: t('page_cost_models.delete_cost_model'),
    deleteAction: () => dispatchProps.deleteCostModel(uuid),
    cancelText: t('page_cost_models.cancel'),
    cancelAction: dispatchProps.closeDialog,
    sourcesNo: sources.length,
  });

  const children = DeleteDialogBody({
    status: stateName,
    sources,
    error: stateProps.deleteError,
    cannotDeleteTitle: t('page_cost_models.cannot_delete_description_head'),
    cannotDeleteBody: t('page_cost_models.cannot_delete_description_body', { name }),
    canDeleteBody: t('page_cost_models.can_delete_description', { name }),
  });

  return {
    actions,
    isOpen: stateName !== 'close',
    variant: ModalVariant.small,
    'aria-label': 'delete-cost-model',
    title: t('page_cost_models.delete_title'),
    titleIconVariant: 'warning',
    onClose: dispatchProps.closeDialog,
    children,
  } as ModalProps;
};

const DeleteDialog = withTranslation()(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Modal));

export default DeleteDialog;
