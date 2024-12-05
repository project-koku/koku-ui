import { Button, ButtonVariant } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import type { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { OverallStatus } from './components/overallStatus';
import { ProviderDetailsContent } from './providerDetailsContent';
import { styles } from './providerStatus.styles';

interface ProviderDetailsModalOwnProps {
  providerType: ProviderType;
}

type ProviderDetailsModalProps = ProviderDetailsModalOwnProps;

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({ providerType }: ProviderDetailsModalProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(messages.integrationsStatus);
  const [variant, setVariant] = useState(ModalVariant.medium);

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setTitle(messages.integrationsStatus);
    setVariant(ModalVariant.medium);
    setIsOpen(true);
  };

  const handleOnBackClick = () => {
    setTitle(messages.integrationsStatus);
    setVariant(ModalVariant.medium);
  };

  const handleOnDetailsClick = () => {
    setTitle(messages.integrationsDetails);
    setVariant(ModalVariant.small);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      <span style={styles.statusLabel}>{intl.formatMessage(messages.integrationsStatus)}</span>
      <OverallStatus providerType={providerType} />
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.viewAll)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={variant}>
        <ModalHeader title={intl.formatMessage(title)} />
        <ModalBody>
          <ProviderDetailsContent
            onBackClick={handleOnBackClick}
            onDetailsClick={handleOnDetailsClick}
            providerType={providerType}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ProviderDetailsModal };
