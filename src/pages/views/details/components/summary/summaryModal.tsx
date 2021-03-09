import './summaryModal.scss';

import { Modal } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { SummaryModalView } from './summaryModalView';

interface SummaryModalOwnProps {
  groupBy: string;
  groupByValue: string | number;
  isOpen: boolean;
  onClose(isOpen: boolean);
  query?: Query;
  reportGroupBy?: string;
  reportPathsType: ReportPathsType;
}

type SummaryModalProps = SummaryModalOwnProps & WithTranslation;

class SummaryModalBase extends React.Component<SummaryModalProps> {
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
    const { groupBy, groupByValue, isOpen, query, reportGroupBy, reportPathsType, t } = this.props;

    return (
      <Modal
        className="modalOverride"
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.summary_modal_title', {
          groupBy: reportGroupBy,
          name: groupByValue,
        })}
        variant="large"
      >
        <SummaryModalView
          groupBy={groupBy}
          groupByValue={groupByValue}
          query={query}
          reportGroupBy={reportGroupBy}
          reportPathsType={reportPathsType}
        />
      </Modal>
    );
  }
}

const SummaryModal = withTranslation()(SummaryModalBase);

export { SummaryModal };
