import { Modal } from '@patternfly/react-core';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { modalOverride } from './summaryModal.styles';
import { SummaryModalView } from './summaryModalView';

interface SummaryModalOwnProps {
  groupBy: string;
  isOpen: boolean;
  item: ComputedReportItem;
  onClose(isOpen: boolean);
  parentGroupBy: string;
  reportPathsType: ReportPathsType;
}

type SummaryModalProps = SummaryModalOwnProps & WrappedComponentProps;

class SummaryModalBase extends React.Component<SummaryModalProps> {
  constructor(props: SummaryModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: SummaryModalProps) {
    const { isOpen, item } = this.props;
    return nextProps.item !== item || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const {
      groupBy,
      isOpen,
      item,
      parentGroupBy,
      reportPathsType,
      intl,
    } = this.props;

    return (
      <Modal
        className={modalOverride}
        isLarge
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(
          { id: 'details.summary_modal_title' },
          {
            groupBy,
            name: item.label,
          }
        )}
      >
        <SummaryModalView
          groupBy={groupBy}
          item={item}
          parentGroupBy={parentGroupBy}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const SummaryModal = injectIntl(SummaryModalBase);

export { SummaryModal };
