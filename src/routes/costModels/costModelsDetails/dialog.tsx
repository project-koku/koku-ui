import type { ModalProps } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { RootState } from 'store';
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
    deleteText: intl.formatMessage(messages.costModelsDelete),
    deleteAction: () => dispatchProps.deleteCostModel(uuid),
    cancelText: intl.formatMessage(messages.cancel),
    cancelAction: dispatchProps.closeDialog,
    sourcesNo: sources.length,
  });

  const children = DeleteDialogBody({
    status: stateName,
    sources,
    error: stateProps.deleteError,
    cannotDeleteTitle: intl.formatMessage(messages.costModelsDeleteSource),
    cannotDeleteBody: intl.formatMessage(messages.costModelsCanNotDelete, { name }),
    canDeleteBody: intl.formatMessage(messages.costModelsCanDelete, { name }),
  });

  return {
    actions,
    isOpen: stateName !== 'close',
    variant: ModalVariant.small,
    'aria-label': intl.formatMessage(messages.costModelsDelete),
    title: intl.formatMessage(messages.costModelsDelete),
    titleIconVariant: 'warning',
    onClose: dispatchProps.closeDialog,
    children,
  } as ModalProps;
};

const DeleteDialog = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Modal));

export default DeleteDialog;
