import { Modal } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { modalOverride, styles } from './clusterModal.styles';
import { ClusterView } from './clusterView';

interface ClusterModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
}

type ClusterModalProps = ClusterModalOwnProps & InjectedTranslateProps;

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
    const { groupBy, isOpen, item, t } = this.props;

    return (
      <Modal
        className={modalOverride}
        style={styles.modal}
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.clusters_modal_title', {
          groupBy,
          name: item.label,
        })}
        width={'50%'}
      >
        <ClusterView item={item} />
      </Modal>
    );
  }
}

const ClusterModal = translate()(ClusterModalBase);

export { ClusterModal };
