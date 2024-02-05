import './modal.scss';

import { Button, ButtonVariant, Modal } from '@patternfly/react-core';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { ClusterInfoContent } from './clusterInfoContent';
import { styles } from './modal.styles';

interface ClusterInfoOwnProps {
  clusterId?: string;
}

type ClusterInfoProps = ClusterInfoOwnProps;

const ClusterInfo: React.FC<ClusterInfoProps> = ({ clusterId }: ClusterInfoProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button onClick={handleOnClick} style={styles.clusterInfo} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.clusterInfo)}
      </Button>
      <Modal
        className="modalOverride"
        isOpen={isOpen}
        onClose={handleClose}
        title={intl.formatMessage(messages.clusterInfo)}
        width={'50%'}
      >
        <ClusterInfoContent clusterId={clusterId} />
      </Modal>
    </>
  );
};

export { ClusterInfo };
