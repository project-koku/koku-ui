import { Alert, Button, Modal, Title, TitleSizes } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { intl as defaultIntl } from 'components/i18n';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

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

const DialogBase: React.SFC<Props> = ({
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
      header={
        <Title headingLevel="h1" size={TitleSizes['2xl']}>
          <ExclamationTriangleIcon color="orange" /> {title}
        </Title>
      }
      isOpen={isOpen}
      onClose={onClose}
      actions={actions}
      variant={isSmall ? 'small' : 'default'}
    >
      {error && <Alert variant="danger" title={`${error}`} />}
      {body}
    </Modal>
  );
};

export default injectIntl(DialogBase);
