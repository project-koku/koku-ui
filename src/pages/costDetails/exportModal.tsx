import { Button, ButtonVariant, Modal, Radio } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { getQuery, Query } from 'api/query';
import { AxiosError } from 'axios';
import fileDownload from 'js-file-download';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { exportActions, exportSelectors } from 'store/export';
import { uiActions, uiSelectors } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { ReportType } from '../../api/reports';
import { FormGroup } from '../../components/formGroup';
import { ComputedReportItem } from '../../utils/getComputedReportItems';
import { sort, SortDirection } from '../../utils/sort';
import { styles } from './exportModal.styles';

export interface Props extends InjectedTranslateProps {
  closeExportModal?: typeof uiActions.closeExportModal;
  error?: AxiosError;
  export?: string;
  exportReport?: typeof exportActions.exportReport;
  fetchStatus?: FetchStatus;
  groupById?: string;
  isAllItems?: boolean;
  isExportModalOpen?: boolean;
  isProviderModalOpen?: boolean;
  items?: ComputedReportItem[];
  query?: Query;
  queryString?: string;
}

interface State {
  resolution: string;
}

const resolutionOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
];

export class ExportModal extends React.Component<Props, State> {
  protected defaultState: State = {
    resolution: 'daily',
  };
  public state: State = { ...this.defaultState };

  public componentDidUpdate(prevProps: Props) {
    const { closeExportModal, fetchStatus, isExportModalOpen } = this.props;
    if (isExportModalOpen && !prevProps.isExportModalOpen) {
      this.setState({ ...this.defaultState });
    }
    if (
      this.props.export !== prevProps.export &&
      fetchStatus === FetchStatus.complete
    ) {
      fileDownload(this.props.export, 'report.csv', 'text/csv');
      closeExportModal();
    }
  }

  private getQueryString = () => {
    const { groupById, isAllItems, items, query } = this.props;
    const { resolution } = this.state;
    const newQuery: Query = {
      ...query,
      group_by: undefined,
      order_by: undefined,
    };
    newQuery.filter.resolution = resolution as any;
    let queryString = getQuery(newQuery);

    if (isAllItems) {
      queryString += `&group_by[${groupById}]=*`;
    } else {
      for (const item of items) {
        queryString += `&group_by[${groupById}]=` + item.label;
      }
    }
    return queryString;
  };

  private handleCancel = () => {
    this.props.closeExportModal();
  };

  private handleFetchReport = () => {
    const { exportReport } = this.props;
    exportReport(ReportType.cost, this.getQueryString());
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const { fetchStatus, groupById, items, t } = this.props;
    const { resolution } = this.state;

    if (this.props.isExportModalOpen) {
      sort(items, {
        key: 'id',
        direction: SortDirection.asc,
      });
    }
    return (
      <Modal
        className={css(styles.modal)}
        isLarge
        isOpen={this.props.isExportModalOpen}
        onClose={this.handleCancel}
        title={t('export.title')}
        actions={[
          <Button
            {...getTestProps(testIds.export.cancel_btn)}
            key="cancel"
            onClick={this.handleCancel}
            variant={ButtonVariant.secondary}
          >
            {t('export.cancel')}
          </Button>,
          <Button
            {...getTestProps(testIds.export.submit_btn)}
            isDisabled={fetchStatus === FetchStatus.inProgress}
            key="confirm"
            onClick={this.handleFetchReport}
            variant={ButtonVariant.primary}
          >
            {t('export.confirm')}
          </Button>,
        ]}
      >
        <h2>{t('export.heading', { groupBy: groupById })}</h2>
        <FormGroup label={t('export.aggregate_type')}>
          <React.Fragment>
            {resolutionOptions.map((option, index) => (
              <div>
                <Radio
                  isDisabled={false}
                  isValid={option.value !== undefined}
                  key={index}
                  value={option.value}
                  checked={resolution === option.value}
                  name="resolution"
                  onChange={this.handleResolutionChange}
                  aria-label={t(option.label)}
                />
                <span>{t(option.label)}</span>
              </div>
            ))}
          </React.Fragment>
        </FormGroup>
        <FormGroup label={t('export.selected', { groupBy: groupById })}>
          <ul>
            {items.map((groupItem, index) => {
              return <li key={index}>{groupItem.label}</li>;
            })}
          </ul>
        </FormGroup>
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    error: exportSelectors.selectExportError(state),
    export: exportSelectors.selectExport(state),
    fetchStatus: exportSelectors.selectExportFetchStatus(state),
    isExportModalOpen: uiSelectors.selectIsExportModalOpen(state),
  })),
  {
    exportReport: exportActions.exportReport,
    closeExportModal: uiActions.closeExportModal,
  }
)(translate()(ExportModal));
