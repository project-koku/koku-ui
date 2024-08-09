import { Button, ButtonVariant } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { OverallStatus } from 'routes/details/components/providerDetails/clusterDetails/components/overallStatus';

import { styles } from './clusterDetails.styles';
import { ClusterDetailsContent } from './clusterDetailsContent';

interface ClusterDetailsModalOwnProps {
  clusterId?: string;
  showStatus?: boolean;
}

type ClusterDetailsModalProps = ClusterDetailsModalOwnProps;

const ClusterDetailsModal: React.FC<ClusterDetailsModalProps> = ({
  clusterId,
  showStatus = true,
}: ClusterDetailsModalProps) => {
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
      {showStatus && <OverallStatus clusterId={clusterId} />}
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.dataDetails)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.small}>
        <ModalHeader title={intl.formatMessage(messages.dataDetails)} />
        <ModalBody>
          <ClusterDetailsContent clusterId={clusterId} />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ClusterDetailsModal };
