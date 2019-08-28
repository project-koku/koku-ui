import { Modal } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { ComputedAzureReportItem } from 'utils/getComputedAzureReportItems';
import { modalOverride, styles } from './detailsWidgetModal.styles';
import { DetailsWidgetModalView } from './detailsWidgetModalView';

interface DetailsWidgetModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedAzureReportItem;
  onClose(isOpen: boolean);
  parentGroupBy: string;
}

type DetailsWidgetModalProps = DetailsWidgetModalOwnProps &
  InjectedTranslateProps;

class DetailsWidgetModalBase extends React.Component<DetailsWidgetModalProps> {
  constructor(props: DetailsWidgetModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: DetailsWidgetModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, parentGroupBy, t } = this.props;

    return (
      <Modal
        className={`${modalOverride} ${css(styles.modal)}`}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('azure_details.widget_modal_title', {
          groupBy,
          name: item.label,
          parentGroupBy,
        })}
      >
        <DetailsWidgetModalView
          groupBy={groupBy}
          item={item}
          parentGroupBy={parentGroupBy}
        />
      </Modal>
    );
  }
}

const DetailsWidgetModal = translate()(DetailsWidgetModalBase);

export { DetailsWidgetModal };
