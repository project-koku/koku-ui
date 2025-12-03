import type { Query } from '@koku-ui/api/queries/query';
import type { ReportPathsType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { SummaryContent } from './summaryContent';

interface SummaryModalOwnProps {
  costDistribution?: string;
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
    const { costDistribution, costType, currency, groupByValue, intl, isOpen, reportGroupBy, reportPathsType } =
      this.props;

    return (
      <Modal className="modalOverride" isOpen={isOpen} onClose={this.handleClose} variant={ModalVariant.large}>
        <ModalHeader
          title={intl.formatMessage(messages.detailsSummaryModalTitle, {
            groupBy: reportGroupBy,
            name: groupByValue,
          })}
        />
        <ModalBody>
          <SummaryContent
            costDistribution={costDistribution}
            costType={costType}
            currency={currency}
            reportGroupBy={reportGroupBy}
            reportPathsType={reportPathsType}
          />
        </ModalBody>
      </Modal>
    );
  }
}

const SummaryModal = injectIntl(SummaryModalBase);

export { SummaryModal };
