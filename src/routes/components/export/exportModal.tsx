import type { MessageDescriptor } from '@formatjs/intl/src/types';
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
import type { ReportPathsType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';
import messages from 'locales/messages';
import { orderBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { ComputedReportItem } from 'routes/utils/computedReport/getComputedReportItems';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { tagPrefix } from 'utils/props';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps {
  count?: number;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // Monthly resolution filters are not valid with date range
  showFormatType?: boolean; // Format type; CVS / JSON
  showTimeScope?: boolean; // timeScope filters are not valid with date range
}

interface ExportModalStateProps {
  isExportsFeatureEnabled?: boolean;
}

interface ExportModalState {
  error?: AxiosError;
  formatType?: 'csv' | 'json';
  name?: string;
  timeScope?: 'current' | 'previous';
  resolution?: string;
}

type ExportModalProps = ExportModalOwnProps & ExportModalStateProps & WrappedComponentProps;

const formatTypeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.exportFormatType, value: 'csv' },
  { label: messages.exportFormatType, value: 'json' },
];

const resolutionOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.exportResolution, value: 'daily' },
  { label: messages.exportResolution, value: 'monthly' },
];

const timeScopeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.exportTimeScope, value: 'current' },
  { label: messages.exportTimeScope, value: 'previous' },
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
    this.handleOnMonthChange = this.handleOnMonthChange.bind(this);
    this.handleOnResolutionChange = this.handleOnResolutionChange.bind(this);
    this.handleOnTypeChange = this.handleOnTypeChange.bind(this);
  }

  // Reset default state upon close -- see https://issues.redhat.com/browse/COST-1134
  private handleOnClose = () => {
    this.setState({ ...this.defaultState }, () => {
      this.props.onClose(false);
    });
  };

  private handleOnError = (error: AxiosError) => {
    this.setState({ error });
  };

  private handleOnMonthChange = (_, event) => {
    this.setState({ timeScope: event.currentTarget.value });
  };

  private handleOnNameChange = (_, event) => {
    this.setState({ name: event.currentTarget.value });
  };

  private handleOnResolutionChange = (_, event) => {
    this.setState({ resolution: event.currentTarget.value });
  };

  private handleOnTypeChange = (_, event) => {
    this.setState({ formatType: event.currentTarget.value });
  };

  private nameValidator = value => {
    if (value.trim().length === 0) {
      return messages.exportNameRequired;
    }
    // Todo: what is the max length allowed?
    if (value.length > 50) {
      return messages.exportNameTooLong;
    }
    return undefined;
  };

  public render() {
    const {
      count = 0,
      groupBy,
      intl,
      isAllItems,
      isExportsFeatureEnabled,
      items,
      reportPathsType,
      reportQueryString,
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
            label: intl.formatMessage(messages.exportAll) as string,
          },
        ];
      } else {
        sortedItems = orderBy(sortedItems, ['label'], ['asc']);
      }
    }

    let selectedLabel = intl.formatMessage(messages.exportSelected, { groupBy, count });
    if (groupBy && groupBy.indexOf(tagPrefix) !== -1) {
      selectedLabel = intl.formatMessage(messages.exportSelected, { groupBy: 'tag', count });
    }

    const thisMonth = new Date();
    const lastMonth = new Date().setMonth(thisMonth.getMonth() - 1);
    const currentMonth = format(thisMonth, 'MMMM yyyy');
    const previousMonth = format(lastMonth - 1, 'MMMM yyyy');

    const defaultName =
      name !== undefined
        ? name
        : intl.formatMessage(messages.exportName, {
            provider: reportPathsType,
            groupBy: groupBy && groupBy.indexOf(tagPrefix) !== -1 ? 'tag' : groupBy,
          });

    const helpText = isExportsFeatureEnabled ? this.nameValidator(defaultName) : undefined;
    const validated = helpText ? 'error' : 'default';

    return (
      <Modal
        style={styles.modal}
        isOpen={this.props.isOpen}
        onClose={this.handleOnClose}
        title={intl.formatMessage(messages.exportTitle)}
        variant="small"
        actions={[
          <ExportSubmit
            disabled={validated === 'error'}
            formatType={formatType}
            groupBy={groupBy}
            isAllItems={isAllItems}
            items={items}
            key="confirm"
            timeScope={showTimeScope ? timeScope : undefined}
            onClose={this.handleOnClose}
            onError={this.handleOnError}
            name={defaultName}
            reportPathsType={reportPathsType}
            reportQueryString={reportQueryString}
            resolution={resolution}
          />,
          <Button ouiaId="cancel-btn" key="cancel" onClick={this.handleOnClose} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        {error && <Alert variant="danger" style={styles.alert} title={intl.formatMessage(messages.exportError)} />}
        <div style={styles.title}>
          {isExportsFeatureEnabled ? (
            <span>
              {intl.formatMessage(messages.exportDesc, { value: <b>{intl.formatMessage(messages.exportsTitle)}</b> })}
            </span>
          ) : (
            <span>{intl.formatMessage(messages.exportHeading, { groupBy })}</span>
          )}
        </div>
        <Form style={styles.form}>
          <Grid hasGutter md={6}>
            {isExportsFeatureEnabled && (
              <GridItem span={12}>
                <FormGroup
                  fieldId="exportName"
                  helperTextInvalid={helpText ? intl.formatMessage(helpText) : undefined}
                  label={intl.formatMessage(messages.names, { count: 1 })}
                  isRequired
                  validated={validated}
                >
                  <TextInput
                    isRequired
                    type="text"
                    id="exportName"
                    name="exportName"
                    value={defaultName}
                    onChange={this.handleOnNameChange}
                  />
                </FormGroup>
              </GridItem>
            )}
            {showAggregateType && (
              <FormGroup fieldId="aggregate-type" label={intl.formatMessage(messages.exportAggregateType)} isRequired>
                <React.Fragment>
                  {resolutionOptions.map((option, index) => (
                    <Radio
                      key={index}
                      id={`resolution-${index}`}
                      isValid={option.value !== undefined}
                      label={intl.formatMessage(option.label, { value: option.value })}
                      value={option.value}
                      isChecked={resolution === option.value}
                      name="resolution"
                      onChange={this.handleOnResolutionChange}
                      aria-label={intl.formatMessage(option.label, { value: option.value })}
                    />
                  ))}
                </React.Fragment>
              </FormGroup>
            )}
            {showTimeScope && (
              <FormGroup fieldId="timeScope" label={intl.formatMessage(messages.exportTimeScopeTitle)} isRequired>
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
                      isChecked={timeScope === option.value}
                      name="timeScope"
                      onChange={this.handleOnMonthChange}
                      aria-label={intl.formatMessage(option.label, {
                        date: option.value === 'previous' ? previousMonth : currentMonth,
                        value: option.value,
                      })}
                    />
                  ))}
                </React.Fragment>
              </FormGroup>
            )}
            {showFormatType && isExportsFeatureEnabled && (
              <GridItem span={12}>
                <FormGroup fieldId="formatType" label={intl.formatMessage(messages.exportFormatTypeTitle)} isRequired>
                  {formatTypeOptions.map((option, index) => (
                    <Radio
                      key={index}
                      id={`formatType-${index}`}
                      isValid={option.value !== undefined}
                      label={intl.formatMessage(option.label, { value: option.value })}
                      value={option.value}
                      isChecked={formatType === option.value}
                      name="formatType"
                      onChange={this.handleOnTypeChange}
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

const mapStateToProps = createMapStateToProps<ExportModalOwnProps, unknown>(state => {
  return {
    isExportsFeatureEnabled: featureFlagsSelectors.selectIsExportsFeatureEnabled(state),
  };
});

const ExportModalConnect = connect(mapStateToProps, undefined)(ExportModalBase);
const ExportModal = injectIntl(ExportModalConnect);

export default ExportModal;
