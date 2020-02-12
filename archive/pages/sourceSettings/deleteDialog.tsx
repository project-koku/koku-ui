import { Button, Modal } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import {
  deleteDialogActions,
  deleteDialogSelectors,
} from 'store/sourceDeleteDialog';

interface Props extends InjectedTranslateProps {
  onDelete: () => void;
  onCancel: typeof deleteDialogActions.closeModal;
  isOpen: boolean;
  isProcessing: boolean;
  isError: boolean;
  name: string;
}

export const DeleteDialogBase: React.SFC<Props> = ({
  t,
  onDelete,
  onCancel,
  isOpen,
  isProcessing,
  isError,
  name,
}) => (
  <Modal
    isSmall
    title={t('source_details.delete.title')}
    onClose={onCancel}
    isOpen={isOpen}
    actions={[
      <Button
        key="cancel"
        isDisabled={isProcessing}
        variant="secondary"
        onClick={onCancel}
      >
        {t('source_details.delete.cancel')}
      </Button>,
      <Button
        key="confirm"
        isDisabled={isProcessing}
        variant="danger"
        onClick={onDelete}
      >
        {t('source_details.delete.delete')}
      </Button>,
    ]}
  >
    {isError
      ? t('source_details.delete.error')
      : t('source_details.delete.message')}
  </Modal>
);

export default connect(
  createMapStateToProps(state => ({
    onDelete: deleteDialogSelectors.onDelete(state),
    isOpen: deleteDialogSelectors.isOpen(state),
    isProcessing: deleteDialogSelectors.isProcessing(state),
    isError: deleteDialogSelectors.isError(state),
    name: deleteDialogSelectors.name(state),
  })),
  {
    onCancel: deleteDialogActions.closeModal,
  }
)(translate()(DeleteDialogBase));
