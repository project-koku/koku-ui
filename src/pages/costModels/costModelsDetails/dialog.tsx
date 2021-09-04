import { Modal, ModalProps, ModalVariant } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import { injectIntl, WrappedComponentProps } from 'react-intl';
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
  ownProps: WrappedComponentProps
) => {
  const { intl = defaultIntl } = ownProps; // Default required for testing
  const stateName = getDialogStateName(stateProps.isLoading, stateProps.isOpen, stateProps.deleteError);
  const data = stateProps.dialogData && stateProps.dialogData.costModel ? stateProps.dialogData.costModel : null;
  const name = data ? data.name : '';
  const sources = data ? data.sources.map(source => source.name) : [];
  const uuid = data ? data.uuid : '';

  const actions = DeleteDialogActions({
    status: stateName,
    deleteText: intl.formatMessage(messages.CostModelsDelete),
    deleteAction: () => dispatchProps.deleteCostModel(uuid),
    cancelText: intl.formatMessage(messages.Cancel),
    cancelAction: dispatchProps.closeDialog,
    sourcesNo: sources.length,
  });

  const children = DeleteDialogBody({
    status: stateName,
    sources,
    error: stateProps.deleteError,
    cannotDeleteTitle: intl.formatMessage(messages.CostModelsDeleteSource),
    cannotDeleteBody: intl.formatMessage(messages.CostModelsCanNotDelete, { name }),
    canDeleteBody: intl.formatMessage(messages.CostModelsCanDelete, { name }),
  });

  return {
    actions,
    isOpen: stateName !== 'close',
    variant: ModalVariant.small,
    'aria-label': intl.formatMessage(messages.CostModelsDelete),
    title: intl.formatMessage(messages.CostModelsDelete),
    titleIconVariant: 'warning',
    onClose: dispatchProps.closeDialog,
    children,
  } as ModalProps;
};

const DeleteDialog = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Modal));

export default DeleteDialog;
