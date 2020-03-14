import { Modal } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { modalOverride } from './detailsTagModal.styles';
import { DetailsTagView } from './detailsTagView';

interface DetailsTagModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
  project: string | number;
}

type DetailsTagModalProps = DetailsTagModalOwnProps & InjectedTranslateProps;

class DetailsTagModalBase extends React.Component<DetailsTagModalProps> {
  constructor(props: DetailsTagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: DetailsTagModalProps) {
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
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('ocp_details.tags_modal_title', {
          groupBy,
          name: item.label,
        })}
        width={'50%'}
      >
        <DetailsTagView
          groupBy={groupBy}
          item={item}
          project={item.label || item.id}
        />
      </Modal>
    );
  }
}

const DetailsTagModal = translate()(DetailsTagModalBase);

export { DetailsTagModal };
