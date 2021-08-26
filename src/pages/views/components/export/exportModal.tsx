import { MessageDescriptor } from '@formatjs/intl/src/types';
import { Alert, Button, ButtonVariant, Form, FormGroup, Modal, Radio } from '@patternfly/react-core';
import { Query, tagPrefix } from 'api/queries/query';
import { ReportPathsType } from 'api/reports/report';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import messages from 'locales/messages';
import { orderBy } from 'lodash';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { exportActions } from 'store/exports';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps {
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  queryString?: string;
  reportPathsType: ReportPathsType;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // monthly resolution filters are not valid with date range
  showTimeScope?: boolean; // timeScope filters are not valid with date range
}

interface ExportModalStateProps {
  // TBD...
}

interface ExportModalDispatchProps {
  exportReport?: typeof exportActions.exportReport;
}

interface ExportModalState {
  error?: AxiosError;
  timeScope: 'current' | 'previous';
  resolution: string;
}

type ExportModalProps = ExportModalOwnProps & ExportModalDispatchProps & ExportModalStateProps & WrappedComponentProps;

const resolutionOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.ExportResolution, value: 'daily' },
  { label: messages.ExportResolution, value: 'monthly' },
];

const timeScopeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.ExportTimeScope, value: 'current' },
  { label: messages.ExportTimeScope, value: 'previous' },
];

export class ExportModalBase extends React.Component<ExportModalProps, ExportModalState> {
  protected defaultState: ExportModalState = {
    error: undefined,
    timeScope: 'current',
    resolution: this.props.resolution || 'monthly',
  };
  public state: ExportModalState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleResolutionChange = this.handleResolutionChange.bind(this);
  }

  // Reset defult state upon close -- see https://issues.redhat.com/browse/COST-1134
  private handleClose = () => {
    this.setState({ ...this.defaultState }, () => {
      this.props.onClose(false);
    });
  };

  private handleError = (error: AxiosError) => {
    this.setState({ error });
  };

  public handleMonthChange = (_, event) => {
    this.setState({ timeScope: event.currentTarget.value });
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public render() {
    const {
      groupBy,
      intl,
      isAllItems,
      items,
      query,
      reportPathsType,
      showAggregateType = true,
      showTimeScope = true,
    } = this.props;
    const { error, resolution, timeScope } = this.state;

    let sortedItems = [...items];
    if (this.props.isOpen) {
      if (items && items.length === 0 && isAllItems) {
        sortedItems = [
          {
            label: intl.formatMessage(messages.ExportAll) as string,
          },
        ];
      } else {
        sortedItems = orderBy(sortedItems, ['label'], ['asc']);
      }
    }

    let selectedLabel = intl.formatMessage(messages.ExportSelected, { groupBy });
    if (groupBy.indexOf(tagPrefix) !== -1) {
      selectedLabel = intl.formatMessage(messages.ExportSelected, { groupBy: 'tag' });
    }

    const thisMonth = new Date();
    const lastMonth = new Date().setMonth(thisMonth.getMonth() - 1);
    const currentMonth = format(thisMonth, 'MMMM yyyy');
    const previousMonth = format(lastMonth - 1, 'MMMM yyyy');

    return (
      <Modal
        style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.ExportTitle)}
        variant="small"
        actions={[
          <ExportSubmit
            groupBy={groupBy}
            isAllItems={isAllItems}
            items={items}
            key="confirm"
            timeScope={showTimeScope ? timeScope : undefined}
            onClose={this.handleClose}
            onError={this.handleError}
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
            {intl.formatMessage(messages.Cancel)}
          </Button>,
        ]}
      >
        {error && <Alert variant="danger" style={styles.alert} title={intl.formatMessage(messages.ExportError)} />}
        <div style={styles.title}>
          <span>{intl.formatMessage(messages.ExportHeading, { groupBy })}</span>
        </div>
        <Form style={styles.form}>
          {showAggregateType && (
            <FormGroup label={intl.formatMessage(messages.ExportAggregateType)} fieldId="aggregate-type">
              <React.Fragment>
                {resolutionOptions.map((option, index) => (
                  <Radio
                    key={index}
                    id={`resolution-${index}`}
                    isValid={option.value !== undefined}
                    label={intl.formatMessage(option.label, { value: option.value })}
                    value={option.value}
                    checked={resolution === option.value}
                    name="resolution"
                    onChange={this.handleResolutionChange}
                    aria-label={intl.formatMessage(option.label, { value: option.value })}
                  />
                ))}
              </React.Fragment>
            </FormGroup>
          )}
          {showTimeScope && (
            <FormGroup label={intl.formatMessage(messages.ExportTimeScopeTitle)} fieldId="timeScope">
              <React.Fragment>
                {timeScopeOptions.map((option, index) => (
                  <Radio
                    key={index}
                    id={`timeScope-${index}`}
                    isValid={option.value !== undefined}
                    label={intl.formatMessage(option.label, {
                      date: option.value === 'previous' ? previousMonth : currentMonth,
                      value: option.value,
                    })}
                    value={option.value}
                    checked={timeScope === option.value}
                    name="timeScope"
                    onChange={this.handleMonthChange}
                    aria-label={intl.formatMessage(option.label, { value: option.value })}
                  />
                ))}
              </React.Fragment>
            </FormGroup>
          )}
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

const mapStateToProps = createMapStateToProps<ExportModalOwnProps, unknown>(() => {
  return {};
});

const mapDispatchToProps: ExportModalDispatchProps = {
  exportReport: exportActions.exportReport,
};

const ExportModalConnect = connect(mapStateToProps, mapDispatchToProps)(ExportModalBase);
const ExportModal = injectIntl(ExportModalConnect);

export { ExportModal, ExportModalProps };
