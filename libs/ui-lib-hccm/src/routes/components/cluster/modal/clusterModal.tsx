import './clusterModal.scss';

import messages from '@koku-ui/i18n/locales/messages';
import { Modal, ModalBody, ModalHeader } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { ClusterContent } from './clusterContent';
import { styles } from './clusterModal.styles';

interface ClusterModalOwnProps {
  clusters: string[];
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  title?: string;
}

type ClusterModalProps = ClusterModalOwnProps & WrappedComponentProps;

class ClusterModalBase extends React.Component<ClusterModalProps, any> {
  constructor(props: ClusterModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: ClusterModalProps) {
    const { clusters, isOpen } = this.props;
    return nextProps.clusters !== clusters || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { clusters, groupBy, intl, isOpen, title } = this.props;

    return (
      <Modal className="modalOverride" style={styles.modal} isOpen={isOpen} onClose={this.handleClose} width={'50%'}>
        <ModalHeader
          title={intl.formatMessage(messages.detailsClustersModalTitle, {
            groupBy,
            name: title,
          })}
        />
        <ModalBody>
          <ClusterContent clusters={clusters} />
        </ModalBody>
      </Modal>
    );
  }
}

const ClusterModal = injectIntl(ClusterModalBase);

export { ClusterModal };
