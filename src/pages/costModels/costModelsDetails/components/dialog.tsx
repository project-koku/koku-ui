import { Alert, Button, Modal, Split, SplitItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  isSmall?: boolean;
  onClose: () => void;
  onProceed: () => void;
  title: string;
  body: React.ReactElement;
  actionText: string;
  isOpen?: boolean;
  isProcessing?: boolean;
  error?: string;
}

const DialogBase: React.SFC<Props> = ({
  t,
  onClose,
  onProceed,
  title,
  body,
  actionText,
  isProcessing = false,
  isOpen = false,
  isSmall = false,
  error = '',
}) => {
  const CancelButtonSecondary = (
    <Button
      key="cancel"
      variant="secondary"
      onClick={onClose}
      isDisabled={isProcessing}
    >
      {t('dialog.cancel')}
    </Button>
  );
  const ProceedButton = (
    <Button
      key="proceed"
      variant="danger"
      onClick={onProceed}
      isDisabled={isProcessing}
    >
      {actionText}
    </Button>
  );
  const CloseButtonPrimary = (
    <Button
      key="close"
      variant="primary"
      onClick={onClose}
      isDisabled={isProcessing}
    >
      {t('dialog.close')}
    </Button>
  );
  const actions =
    actionText !== ''
      ? [ProceedButton, CancelButtonSecondary]
      : [CloseButtonPrimary];
  return (
    <Modal
      isFooterLeftAligned
      isSmall={isSmall}
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      actions={actions}
    >
      {error && <Alert variant="danger" title={`${error}`} />}
      <Split gutter="md">
        <SplitItem>
          <ExclamationTriangleIcon size="xl" color="orange" />
        </SplitItem>
        <SplitItem isFilled>{body}</SplitItem>
      </Split>
    </Modal>
  );
};

export default translate()(DialogBase);
