import { Button, ButtonVariant } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { OverallStatus } from 'routes/details/ocpBreakdown/providerDetails/dataDetails/components/overallStatus';

import { styles } from './dataDetails.styles';
import { DataDetailsContent } from './dataDetailsContent';

interface DataDetailsOwnProps {
  clusterId?: string;
}

type DataDetailsProps = DataDetailsOwnProps;

const DataDetails: React.FC<DataDetailsProps> = ({ clusterId }: DataDetailsProps) => {
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
      <div style={styles.description}>
        <OverallStatus clusterId={clusterId} />
        <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
          {intl.formatMessage(messages.dataDetails)}
        </Button>
      </div>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.small}>
        <ModalHeader title={intl.formatMessage(messages.dataDetails)} />
        <ModalBody>
          <DataDetailsContent clusterId={clusterId} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default DataDetails;
