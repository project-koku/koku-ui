import './summaryModal.scss';

import { Modal } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import type { ReportPathsType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { SummaryModalContent } from './summaryModalContent';

interface SummaryModalOwnProps {
  costType?: string;
  currency?: string;
  groupBy: string;
  groupByValue: string | number;
  isOpen: boolean;
  onClose(isOpen: boolean);
  query?: Query;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

type SummaryModalProps = SummaryModalOwnProps & WrappedComponentProps;

class SummaryModalBase extends React.Component<SummaryModalProps, any> {
  constructor(props: SummaryModalProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  public shouldComponentUpdate(nextProps: SummaryModalProps) {
    const { groupByValue, isOpen } = this.props;
    return nextProps.groupByValue !== groupByValue || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { costType, currency, groupByValue, intl, isOpen, reportGroupBy, reportPathsType } = this.props;

    return (
      <Modal
        className="modalOverride"
        isOpen={isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.detailsSummaryModalTitle, {
          groupBy: reportGroupBy,
          name: groupByValue,
        })}
        variant="large"
      >
        <SummaryModalContent
          costType={costType}
          currency={currency}
          reportGroupBy={reportGroupBy}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const SummaryModal = injectIntl(SummaryModalBase);

export { SummaryModal };
