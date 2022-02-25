import { MessageDescriptor } from '@formatjs/intl/src/types';
import {
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Modal,
  Radio,
  TextInput,
} from '@patternfly/react-core';
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
import { exportActions } from 'store/export';
import { getTestProps, testIds } from 'testIds';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';
import { FeatureType, isFeatureVisible } from 'utils/feature';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps {
  count?: number;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  query?: Query;
  queryString?: string;
  reportPathsType: ReportPathsType;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // Monthly resolution filters are not valid with date range
  showFormatType?: boolean; // Format type; CVS / JSON
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
  formatType: 'csv' | 'json';
  name?: string;
  timeScope: 'current' | 'previous';
  resolution: string;
}

type ExportModalProps = ExportModalOwnProps & ExportModalDispatchProps & ExportModalStateProps & WrappedComponentProps;

const formatTypeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.ExportFormatType, value: 'csv' },
  { label: messages.ExportFormatType, value: 'json' },
];

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
    formatType: 'csv',
    timeScope: 'current',
    resolution: this.props.resolution || 'monthly',
  };
  public state: ExportModalState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleMonthChange = this.handleMonthChange.bind(this);
    this.handleResolutionChange = this.handleResolutionChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
  }

  // Reset default state upon close -- see https://issues.redhat.com/browse/COST-1134
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

  public handleNameChange = (_, event) => {
    this.setState({ name: event.currentTarget.value });
  };

  public handleResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  public handleTypeChange = (_, event) => {
    this.setState({ formatType: event.currentTarget.value });
  };

  public render() {
    const {
      count = 0,
      groupBy,
      intl,
      isAllItems,
      items,
      query,
      reportPathsType,
      showAggregateType = true,
      showFormatType = true,
      showTimeScope = true,
    } = this.props;
    const { error, formatType, name, resolution, timeScope } = this.state;

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

    let selectedLabel = intl.formatMessage(messages.ExportSelected, { groupBy, count });
    if (groupBy.indexOf(tagPrefix) !== -1) {
      selectedLabel = intl.formatMessage(messages.ExportSelected, { groupBy: 'tag', count });
    }

    const thisMonth = new Date();
    const lastMonth = new Date().setMonth(thisMonth.getMonth() - 1);
    const currentMonth = format(thisMonth, 'MMMM yyyy');
    const previousMonth = format(lastMonth - 1, 'MMMM yyyy');

    const defaultName = name
      ? name
      : intl.formatMessage(messages.ExportName, {
          provider: reportPathsType,
          groupBy: groupBy.indexOf(tagPrefix) !== -1 ? 'tag' : groupBy,
        });

    return (
      <Modal
        style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
        title={intl.formatMessage(messages.ExportTitle)}
        variant="small"
        actions={[
          <ExportSubmit
            formatType={formatType}
            groupBy={groupBy}
            isAllItems={isAllItems}
            items={items}
            key="confirm"
            timeScope={showTimeScope ? timeScope : undefined}
            onClose={this.handleClose}
            onError={this.handleError}
            name={defaultName}
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
          {/* Todo: Show in-progress features in beta environment only */}
          {isFeatureVisible(FeatureType.exports) ? (
            <span>
              {intl.formatMessage(messages.ExportDesc, { value: <b>{intl.formatMessage(messages.ExportsTitle)}</b> })}
            </span>
          ) : (
            <span>{intl.formatMessage(messages.ExportHeading, { groupBy })}</span>
          )}
        </div>
        <Form style={styles.form}>
          <Grid hasGutter md={6}>
            {/* Todo: Show in-progress features in beta environment only */}
            {isFeatureVisible(FeatureType.exports) && (
              <GridItem span={12}>
                <FormGroup label={intl.formatMessage(messages.Names, { count: 1 })} fieldId="exportName" isRequired>
                  <TextInput
                    isRequired
                    type="text"
                    id="exportName"
                    name="exportName"
                    value={defaultName}
                    onChange={this.handleNameChange}
                  />
                </FormGroup>
              </GridItem>
            )}
            {showAggregateType && (
              <FormGroup label={intl.formatMessage(messages.ExportAggregateType)} fieldId="aggregate-type" isRequired>
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
              <FormGroup label={intl.formatMessage(messages.ExportTimeScopeTitle)} fieldId="timeScope" isRequired>
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
                      aria-label={intl.formatMessage(option.label, {
                        date: option.value === 'previous' ? previousMonth : currentMonth,
                        value: option.value,
                      })}
                    />
                  ))}
                </React.Fragment>
              </FormGroup>
            )}
            {/* Todo: Show in-progress features in beta environment only */}
            {showFormatType && isFeatureVisible(FeatureType.exports) && (
              <GridItem span={12}>
                <FormGroup label={intl.formatMessage(messages.ExportFormatTypeTitle)} fieldId="formatType" isRequired>
                  {formatTypeOptions.map((option, index) => (
                    <Radio
                      key={index}
                      id={`formatType-${index}`}
                      isValid={option.value !== undefined}
                      label={intl.formatMessage(option.label, { value: option.value })}
                      value={option.value}
                      checked={formatType === option.value}
                      name="formatType"
                      onChange={this.handleTypeChange}
                      aria-label={intl.formatMessage(option.label, { value: option.value })}
                    />
                  ))}
                </FormGroup>
              </GridItem>
            )}
            <GridItem span={12}>
              <FormGroup label={selectedLabel} fieldId="selectedLabels">
                <ul>
                  {sortedItems.map((groupItem, index) => {
                    return <li key={index}>{groupItem.label}</li>;
                  })}
                </ul>
              </FormGroup>
            </GridItem>
          </Grid>
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
