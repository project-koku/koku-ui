import { Modal } from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { modalOverride } from './summaryModal.styles';
import { SummaryModalView } from './summaryModalView';

interface SummaryModalOwnProps {
  filterBy: string | number;
  groupBy: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  parentGroupBy: string;
  reportPathsType: ReportPathsType;
}

type SummaryModalProps = SummaryModalOwnProps & InjectedTranslateProps;

class SummaryModalBase extends React.Component<SummaryModalProps> {
  constructor(props: SummaryModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: SummaryModalProps) {
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const {
      filterBy,
      groupBy,
      isOpen,
      parentGroupBy,
      reportPathsType,
      t,
    } = this.props;

    return (
      <Modal
        className={modalOverride}
        variant="large"
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.summary_modal_title', {
          groupBy,
          name: filterBy,
        })}
      >
        <SummaryModalView
          filterBy={filterBy}
          groupBy={groupBy}
          parentGroupBy={parentGroupBy}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const SummaryModal = translate()(SummaryModalBase);

export { SummaryModal };
