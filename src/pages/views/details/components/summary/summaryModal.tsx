import './summaryModal.scss';

import { Modal } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { SummaryModalView } from './summaryModalView';

interface SummaryModalOwnProps {
  filterBy: string | number;
  groupBy: string;
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
    const { filterBy, isOpen } = this.props;
    return nextProps.filterBy !== filterBy || nextProps.isOpen !== isOpen;
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public render() {
    const { filterBy, groupBy, isOpen, query, reportGroupBy, reportPathsType, t } = this.props;

    return (
      <Modal
        className="modalOverride"
        isOpen={isOpen}
        onClose={this.handleClose}
        title={t('details.summary_modal_title', {
          groupBy: reportGroupBy,
          name: filterBy,
        })}
        variant="large"
      >
        <SummaryModalView
          filterBy={filterBy}
          groupBy={groupBy}
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
