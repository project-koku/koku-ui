import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import type { RootState } from '../../../../store';
import { costModelsActions, costModelsSelectors } from '../../../../store/costModels';
import { type RouterComponentProps, withRouter } from '../../../../utils/router';
import { DeleteDialogActions, DeleteDialogBody, getDialogStateName } from './utils/dialog';

export interface ReportSummaryProps extends WrappedComponentProps {
  actions?: React.ReactNode;
  ariaLabel?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  titleIconVariant?: 'warning';
  variant?: ModalVariant;
}

const DeleteDialogBase: React.FC<ReportSummaryProps> = ({
  actions,
  ariaLabel: ariaLabel,
  children,
  isOpen,
  onClose,
  title,
  titleIconVariant,
  variant,
}) => (
  <Modal aria-label={ariaLabel} isOpen={isOpen} onClose={onClose} variant={variant}>
    <ModalHeader title={title} titleIconVariant={titleIconVariant} />
    <ModalBody>{children}</ModalBody>
    <ModalFooter>{actions}</ModalFooter>
  </Modal>
);

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
    deleteCostModel: (uuid: string, router) =>
      costModelsActions.deleteCostModel(uuid, 'deleteCostModel', router)(dispatch),
  };
};

interface Props extends RouterComponentProps, WrappedComponentProps {}

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: ReturnType<typeof mapDispatchToProps>,
  ownProps: Props
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
    deleteAction: () => dispatchProps.deleteCostModel(uuid, ownProps.router),
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
    ariaLabel: intl.formatMessage(messages.costModelsDelete),
    title: intl.formatMessage(messages.costModelsDelete),
    titleIconVariant: 'warning',
    onClose: dispatchProps.closeDialog,
    children,
  };
};

const DeleteDialog = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(DeleteDialogBase)));

export default DeleteDialog;
