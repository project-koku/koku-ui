import { Modal, ModalBody, ModalHeader } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { StorageData } from 'routes/details/ocpBreakdown/virtualization/storage/storageLink';

import { StorageContent } from './storageContent';

interface StorageModalOwnProps extends WrappedComponentProps {
  isOpen: boolean;
  onClose(isOpen: boolean);
  storageData?: StorageData[];
  virtualMachine?: string;
}

type StorageModalProps = StorageModalOwnProps;

class StorageModalBase extends React.Component<StorageModalProps, any> {
  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { intl, isOpen, storageData, virtualMachine } = this.props;

    return (
      <Modal className="costManagement" isOpen={isOpen} onClose={this.handleClose} width={'50%'}>
        <ModalHeader title={intl.formatMessage(messages.storageHeadingTitle, { value: storageData?.length })} />
        <ModalBody>
          <StorageContent storageData={storageData} virtualMachine={virtualMachine} />
        </ModalBody>
      </Modal>
    );
  }
}

const StorageModal = injectIntl(StorageModalBase);

export { StorageModal };
