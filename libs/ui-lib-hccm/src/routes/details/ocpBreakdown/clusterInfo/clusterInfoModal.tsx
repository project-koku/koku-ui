import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { styles } from './clusterInfo.styles';
import { ClusterInfoContent } from './clusterInfoContent';

interface ClusterInfoModalOwnProps {
  clusterId?: string;
}

type ClusterInfoModalProps = ClusterInfoModalOwnProps;

const ClusterInfoModal: React.FC<ClusterInfoModalProps> = ({ clusterId }: ClusterInfoModalProps) => {
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
      <Button onClick={handleOnClick} style={styles.clusterInfoButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.clusterInfo)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.medium}>
        <ModalHeader title={intl.formatMessage(messages.clusterInfo)} />
        <ModalBody>
          <ClusterInfoContent clusterId={clusterId} />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ClusterInfoModal };
