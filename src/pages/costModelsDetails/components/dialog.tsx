import { Button, Modal, Split, SplitItem } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  onClose: () => void;
  onProceed: () => void;
  title: string;
  body: React.ReactElement;
  actionText: string;
  isOpen?: boolean;
  isProcessing?: boolean;
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
}) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button
          key="cancel"
          variant="secondary"
          onClick={onClose}
          isDisabled={isProcessing}
        >
          {t('dialog.cancel')}
        </Button>,
        <Button
          key="proceed"
          variant="danger"
          onClick={onProceed}
          isDisabled={isProcessing}
        >
          {actionText}
        </Button>,
      ]}
    >
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
