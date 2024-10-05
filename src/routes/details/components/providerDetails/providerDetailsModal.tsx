import { Button, ButtonVariant } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import type { ProviderType } from 'api/providers';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { OverallStatus } from './components/overallStatus';
import { styles } from './providerDetails.styles';
import { ProviderDetailsContent } from './providerDetailsContent';

interface ProviderDetailsModalOwnProps {
  clusterId?: string;
  isLastUpdatedStatus?: boolean;
  isOverallStatus?: boolean;
  providerId?: string;
  providerType: ProviderType;
  uuId?: string;
}

type ProviderDetailsModalProps = ProviderDetailsModalOwnProps;

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  clusterId,
  isOverallStatus = true,
  isLastUpdatedStatus,
  providerId,
  providerType,
  uuId,
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
      {isOverallStatus && (
        <OverallStatus
          clusterId={clusterId}
          isLastUpdatedStatus={isLastUpdatedStatus}
          providerId={providerId}
          providerType={providerType}
          uuId={uuId}
        />
      )}
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.dataDetails)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.small}>
        <ModalHeader title={intl.formatMessage(messages.dataDetails)} />
        <ModalBody>
          <ProviderDetailsContent
            clusterId={clusterId}
            providerId={providerId}
            providerType={providerType}
            uuId={uuId}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ProviderDetailsModal };
