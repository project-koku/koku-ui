import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  Radio,
  Title,
} from '@patternfly/react-core';
import { Query, tagPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { exportActions } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { sort, SortDirection } from 'utils/sort';
import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps extends InjectedTranslateProps {
  error?: AxiosError;
  export?: string;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  queryString?: string;
  reportPathsType: ReportPathsType;
}

interface ExportModalDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportModalState {
  resolution: string;
}

type ExportModalProps = ExportModalOwnProps &
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
    const { isOpen } = this.props;

    if (isOpen && !prevProps.isOpen) {
      this.setState({ ...this.defaultState });
    }
  }

  private handleClose = () => {
    this.props.onClose(false);
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const {
      groupBy,
      isAllItems,
      items,
      query,
      reportPathsType,
      t,
    } = this.props;
    const { resolution } = this.state;

    const sortedItems = [...items];
    if (this.props.isOpen) {
      sort(sortedItems, {
        key: 'id',
        direction: SortDirection.asc,
      });
    }

    let selectedLabel = t('export.selected', { groupBy });
    if (groupBy.indexOf(tagPrefix) !== -1) {
      selectedLabel = t('export.selected_tags');
    }

    return (
      <Modal
        style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={t('export.title')}
        variant="small"
        actions={[
          <ExportSubmit
            groupBy={groupBy}
            isAllItems={isAllItems}
            items={items}
            key="confirm"
            onClose={this.handleClose}
            query={query}
            reportPathsType={reportPathsType}
            resolution={resolution}
          />,
          <Button
            {...getTestProps(testIds.export.cancel_btn)}
            key="cancel"
            onClick={this.handleClose}
            variant={ButtonVariant.link}
          >
            {t('export.cancel')}
          </Button>
        ]}
      >
        <Title headingLevel="h2" style={styles.title} size="xl">
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

const mapStateToProps = createMapStateToProps<ExportModalOwnProps, {}>(
  (state, props) => {
    return {};
  }
);

const mapDispatchToProps: ExportModalDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportModal = translate()(
  connect(mapStateToProps, mapDispatchToProps)(ExportModalBase)
);

export { ExportModal, ExportModalProps };
