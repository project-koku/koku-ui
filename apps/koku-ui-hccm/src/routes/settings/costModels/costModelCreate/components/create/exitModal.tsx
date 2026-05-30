import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface ExitModalOwnProps {
  isOpen?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}

// defaultIntl required for testing
const ExitModal: React.FC<ExitModalOwnProps> = ({ isOpen, onCancel, onConfirm }) => {
  const intl = useIntl();

  return (
    <Modal
      aria-label={intl.formatMessage(messages.createCostModelExit)}
      isOpen={isOpen}
      onClose={onCancel}
      variant={ModalVariant.small}
    >
      <ModalHeader>
        <Title headingLevel="h1" size={TitleSizes['2xl']}>
          <Icon status="warning">
            <ExclamationTriangleIcon />
          </Icon>{' '}
          {intl.formatMessage(messages.createCostModelExit)}
        </Title>
      </ModalHeader>
      <ModalBody>{intl.formatMessage(messages.createCostModelConfirmMsg)}</ModalBody>
      <ModalFooter>
        <Button onClick={onConfirm} variant="primary">
          {intl.formatMessage(messages.createCostModelExitYes)}
        </Button>
        <Button onClick={onCancel} variant="link">
          {intl.formatMessage(messages.createCostModelNoContinue)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ExitModal };
