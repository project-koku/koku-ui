import { Alert, Button, Modal, Split, SplitItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface Props extends WrappedComponentProps {
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
  intl,
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
      {intl.formatMessage({ id: 'dialog.cancel' })}
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
      {intl.formatMessage({ id: 'dialog.close' })}
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

export default injectIntl(DialogBase);
