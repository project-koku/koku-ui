import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  Radio,
  Title,
} from '@patternfly/react-core';
import { AzureQuery, getQuery } from 'api/queries/azureQuery';
import { tagKeyPrefix } from 'api/queries/query';
import { ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  azureExportActions,
  azureExportSelectors,
} from 'store/exports/azureExport';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { sort, SortDirection } from 'utils/sort';
import { styles } from './exportModal.styles';

export interface ExportModalOwnProps extends InjectedTranslateProps {
  error?: AxiosError;
  export?: string;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: AzureQuery;
  queryString?: string;
}

interface ExportModalStateProps {
  fetchStatus?: FetchStatus;
}

interface ExportModalDispatchProps {
  exportReport?: typeof azureExportActions.exportReport;
}

interface ExportModalState {
  resolution: string;
}

type ExportModalProps = ExportModalOwnProps &
  ExportModalStateProps &
  ExportModalDispatchProps &
  InjectedTranslateProps;

const resolutionOptions: {
  label: string;
  value: string;
}[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
];

export class ExportModalBase extends React.Component<
  ExportModalProps,
  ExportModalState
> {
  protected defaultState: ExportModalState = {
    resolution: 'daily',
  };
  public state: ExportModalState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleResolutionChange = this.handleResolutionChange.bind(this);
  }

  public componentDidUpdate(prevProps: ExportModalProps) {
    const { fetchStatus, isOpen } = this.props;
    if (isOpen && !prevProps.isOpen) {
      this.setState({ ...this.defaultState });
    }
    if (
      prevProps.export !== this.props.export &&
      fetchStatus === FetchStatus.complete
    ) {
      this.handleClose();
    }
  }

  private getQueryString = () => {
    const { groupBy, isAllItems, items, query } = this.props;
    const { resolution } = this.state;

    const newQuery: AzureQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: undefined,
      order_by: undefined,
    };
    newQuery.filter.resolution = resolution as any;
    let queryString = getQuery(newQuery);

    if (isAllItems) {
      queryString += `&group_by[${groupBy}]=*`;
    } else {
      for (const item of items) {
        queryString += `&group_by[${groupBy}]=` + item.label;
      }
    }
    return queryString;
  };

  private handleClose = () => {
    this.props.onClose(false);
  };

  private handleFetchReport = () => {
    const { exportReport } = this.props;
    exportReport(ReportType.cost, this.getQueryString());
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const { fetchStatus, groupBy, items, t } = this.props;
    const { resolution } = this.state;

    const sortedItems = [...items];
    if (this.props.isOpen) {
      sort(sortedItems, {
        key: 'id',
        direction: SortDirection.asc,
      });
    }

    let selectedLabel = t('export.selected', { groupBy });
    if (groupBy.indexOf(tagKeyPrefix) !== -1) {
      selectedLabel = t('export.selected_tags');
    }

    return (
      <Modal
        style={styles.modal}
        isLarge
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={t('export.title')}
        actions={[
          <Button
            {...getTestProps(testIds.export.cancel_btn)}
            key="cancel"
            onClick={this.handleClose}
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
        <Title style={styles.title} size="xl">
          {t('export.heading', { groupBy })}
        </Title>
        <Form style={styles.form}>
          <FormGroup
            label={t('export.aggregate_type')}
            fieldId="aggregate-type"
          >
            <React.Fragment>
              {resolutionOptions.map((option, index) => (
                <Radio
                  key={index}
                  id={`resolution-${index}`}
                  isValid={option.value !== undefined}
                  label={t(option.label)}
                  value={option.value}
                  checked={resolution === option.value}
                  name="resolution"
                  onChange={this.handleResolutionChange}
                  aria-label={t(option.label)}
                />
              ))}
            </React.Fragment>
          </FormGroup>
          <FormGroup label={selectedLabel} fieldId="selected-labels">
            <ul>
              {sortedItems.map((groupItem, index) => {
                return <li key={index}>{groupItem.label}</li>;
              })}
            </ul>
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  ExportModalOwnProps,
  ExportModalStateProps
>(state => {
  return {
    error: azureExportSelectors.selectExportError(state),
    export: azureExportSelectors.selectExport(state),
    fetchStatus: azureExportSelectors.selectExportFetchStatus(state),
  };
});

const mapDispatchToProps: ExportModalDispatchProps = {
  exportReport: azureExportActions.exportReport,
};

const ExportModal = translate()(
  connect(mapStateToProps, mapDispatchToProps)(ExportModalBase)
);

export { ExportModal, ExportModalProps };
