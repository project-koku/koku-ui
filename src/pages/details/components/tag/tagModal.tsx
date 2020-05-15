import { Modal } from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { modalOverride } from './tagModal.styles';
import { TagView } from './tagView';

interface TagModalOwnProps {
  account: string | number;
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
}

type TagModalProps = TagModalOwnProps & WrappedComponentProps;

class TagModalBase extends React.Component<TagModalProps> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: TagModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { groupBy, isOpen, item, reportPathsType, intl } = this.props;

    return (
      <Modal
        className={modalOverride}
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(
          { id: 'details.tags_modal_title' },
          {
            groupBy,
            name: item.label,
          }
        )}
        width={'50%'}
      >
        <TagView
          account={item.label || item.id}
          groupBy={groupBy}
          item={item}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const TagModal = injectIntl(TagModalBase);

export { TagModal };
