import { Button, ButtonVariant } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { ClusterContent } from './clusterContent';
import { styles } from './clusterInfo.styles';

interface ClusterInfoOwnProps {
  clusterId?: string;
}

type ClusterInfoProps = ClusterInfoOwnProps;

const ClusterInfo: React.FC<ClusterInfoProps> = ({ clusterId }: ClusterInfoProps) => {
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
      <Button onClick={handleOnClick} style={styles.clusterInfo} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.clusterInfo)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.medium}>
        <ModalHeader title={intl.formatMessage(messages.clusterInfo)} />
        <ModalBody>
          <ClusterContent clusterId={clusterId} />
        </ModalBody>
      </Modal>
    </>
  );
};

export { ClusterInfo };
