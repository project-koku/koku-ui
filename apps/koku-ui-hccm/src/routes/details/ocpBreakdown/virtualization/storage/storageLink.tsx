import React from 'react';

import { StorageModal } from './modal/storageModal';
import { styles } from './storage.styles';

interface StorageLinkOwnProps {
  storageData?: StorageData[];
  virtualMachine?: string;
}

interface StorageLinkState {
  isOpen: boolean;
}

export interface StorageData {
  usage?: string;
  capacity?: string;
  pvc_name?: string;
  usage_units?: string;
  storage_class?: string;
}

type StorageLinkProps = StorageLinkOwnProps;

class StorageLink extends React.Component<StorageLinkProps, StorageLinkState> {
  protected defaultState: StorageLinkState = {
    isOpen: false,
  };
  public state: StorageLinkState = { ...this.defaultState };

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { storageData, virtualMachine } = this.props;
    const { isOpen } = this.state;

    if (!storageData || storageData?.length === 0) {
      return 0;
    }
    return (
      <div style={styles.storagesContainer}>
        <a data-testid="storage-lnk" href="#/" onClick={this.handleOpen} style={styles.storageLink}>
          {storageData.length}
        </a>
        <StorageModal
          isOpen={isOpen}
          onClose={this.handleClose}
          storageData={storageData}
          virtualMachine={virtualMachine}
        />
      </div>
    );
  }
}

export default StorageLink;
