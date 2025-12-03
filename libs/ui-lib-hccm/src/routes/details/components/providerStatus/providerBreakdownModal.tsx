import type { ProviderType } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { OverallStatus } from './components/overallStatus';
import { ProviderBreakdownContent } from './providerBreakdownContent';
import { styles } from './providerStatus.styles';

interface ProviderDetailsModalOwnProps {
  clusterId?: string;
  isOverallStatus?: boolean;
  providerId?: string;
  providerType: ProviderType;
  uuId?: string;
}

type ProviderDetailsModalProps = ProviderDetailsModalOwnProps;

const ProviderBreakdownModal: React.FC<ProviderDetailsModalProps> = ({
  clusterId,
  isOverallStatus,
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
    setIsOpen(true);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {isOverallStatus && (
        <OverallStatus clusterId={clusterId} providerId={providerId} providerType={providerType} uuId={uuId} />
      )}
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.dataDetails)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.small}>
        <ModalHeader title={intl.formatMessage(messages.dataDetails)} />
        <ModalBody>
          <ProviderBreakdownContent
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

export { ProviderBreakdownModal };
