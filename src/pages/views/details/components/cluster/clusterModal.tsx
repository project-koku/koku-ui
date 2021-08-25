import './clusterModal.scss';

import { Modal } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import { styles } from './clusterModal.styles';
import { ClusterView } from './clusterView';

interface ClusterModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
}

type ClusterModalProps = ClusterModalOwnProps & WrappedComponentProps;

class ClusterModalBase extends React.Component<ClusterModalProps> {
  constructor(props: ClusterModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: ClusterModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, intl } = this.props;

    return (
      <Modal
        className="modalOverride"
        style={styles.modal}
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.DetailsClustersModalTitle, {
          groupBy: intl.formatMessage(messages.GroupByValues, { value: groupBy, count: 1 }),
          name: item.label,
        })}
        width={'50%'}
      >
        <ClusterView item={item} />
      </Modal>
    );
  }
}

const ClusterModal = injectIntl(ClusterModalBase);

export { ClusterModal };
