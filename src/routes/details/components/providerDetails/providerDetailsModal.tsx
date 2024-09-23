import { Button, ButtonVariant, Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { OverallStatus } from './components/overallStatus';
import { styles } from './providerDetails.styles';
import { ProviderDetailsContent } from './providerDetailsContent';

interface ProviderDetailsModalOwnProps {
  clusterId?: string;
  showStatus?: boolean;
  providerId?: string;
  providerType: ProviderType;
}

type ProviderDetailsModalProps = ProviderDetailsModalOwnProps;

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  clusterId,
  providerId,
  providerType,
  showStatus = true,
}: ProviderDetailsModalProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {showStatus && <OverallStatus clusterId={clusterId} providerId={providerId} providerType={providerType} />}
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.dataDetails)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.small}>
        <ModalHeader title={intl.formatMessage(messages.dataDetails)} />
        <ModalBody>
          <ProviderDetailsContent clusterId={clusterId} providerId={providerId} providerType={providerType} />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ProviderDetailsModal };
