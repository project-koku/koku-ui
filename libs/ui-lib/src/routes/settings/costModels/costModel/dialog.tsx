import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface Props extends WrappedComponentProps {
  isSmall?: boolean;
  onClose: () => void;
  onProceed: () => void;
  title: string;
  body: React.ReactElement;
  actionText?: string;
  isOpen?: boolean;
  isProcessing?: boolean;
  error?: string;
}

const DialogBase: React.FC<Props> = ({
  intl = defaultIntl, // Default required for testing
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
    <Button key="cancel" variant="link" onClick={onClose} isDisabled={isProcessing}>
      {intl.formatMessage(messages.cancel)}
    </Button>
  );
  const ProceedButton = (
    <Button key="proceed" variant="danger" onClick={onProceed} isDisabled={isProcessing}>
      {actionText}
    </Button>
  );
  const CloseButtonPrimary = (
    <Button key="close" variant="primary" onClick={onClose} isDisabled={isProcessing}>
      {intl.formatMessage(messages.close)}
    </Button>
  );
  const actions = actionText !== '' ? [ProceedButton, CancelButtonSecondary] : [CloseButtonPrimary];
  return (
    <Modal
      aria-label={title}
      isOpen={isOpen}
      onClose={onClose}
      variant={isSmall ? ModalVariant.small : ModalVariant.default}
    >
      <ModalHeader title={title} titleIconVariant="warning" />
      <ModalBody>
        {error && <Alert variant="danger" title={`${error}`} />}
        {body}
      </ModalBody>
      <ModalFooter>{actions}</ModalFooter>
    </Modal>
  );
};

export default injectIntl(DialogBase);
