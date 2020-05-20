import { Modal } from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { modalOverride } from './tagModal.styles';
import { TagView } from './tagView';

interface TagModalOwnProps {
  filterBy: string | number;
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
}

type TagModalProps = TagModalOwnProps & InjectedTranslateProps;

class TagModalBase extends React.Component<TagModalProps> {
  constructor(props: TagModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: TagModalProps) {
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { filterBy, groupBy, isOpen, reportPathsType, t } = this.props;

    return (
      <Modal
        className={modalOverride}
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.tags_modal_title', {
          groupBy,
          name: filterBy,
        })}
        width={'50%'}
      >
        <TagView
          filterBy={filterBy}
          groupBy={groupBy}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const TagModal = translate()(TagModalBase);

export { TagModal };
