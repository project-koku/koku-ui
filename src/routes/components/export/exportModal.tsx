import type { MessageDescriptor } from '@formatjs/intl/src/types';
import {
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Modal,
  Radio,
  TextInput,
} from '@patternfly/react-core';
import type { ReportPathsType, ReportType } from 'api/reports/report';
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
import { FeatureToggleSelectors } from 'store/featureToggle';
import { tagPrefix } from 'utils/props';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps {
  count?: number;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  isTimeScoped?: boolean;
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  reportType: ReportType;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // Monthly resolution filters are not valid with date range
  showFormatType?: boolean; // Format type; CVS / JSON
  showTimeScope?: boolean; // timeScope filters are not valid with date range
  timeScopeValue?: number;
}

interface ExportModalStateProps {
  isDetailsDateRangeToggleEnabled?: boolean;
  isExportsToggleEnabled?: boolean;
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
    resolution: this.props.resolution || 'monthly',
    timeScope: this.props.timeScopeValue === -2 ? 'previous' : 'current',
  };
  public state: ExportModalState = { ...this.defaultState };

  public componentDidUpdate(prevProps: ExportModalProps) {
    const { timeScopeValue } = this.props;

    if (timeScopeValue !== prevProps.timeScopeValue) {
      this.setState({ timeScope: timeScopeValue === -2 ? 'previous' : 'current' });
    }
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

  private handleOnMonthChange = event => {
    this.setState({ timeScope: event.currentTarget.value });
  };

  private handleOnNameChange = event => {
    this.setState({ name: event.currentTarget.value });
  };

  private handleOnResolutionChange = event => {
    this.setState({ resolution: event.currentTarget.value });
  };

  private handleOnTypeChange = event => {
    this.setState({ formatType: event.currentTarget.value });
  };

  private nameValidator = value => {
    if (value.trim().length === 0) {
      return messages.exportNameRequired;
    }
    // Todo: what is the max length allowed?
    if (value.length > 255) {
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
      isDetailsDateRangeToggleEnabled,
      isExportsToggleEnabled,
      isTimeScoped,
      items,
      reportPathsType,
      reportQueryString,
      reportType,
      showAggregateType = true,
      showFormatType = true,
      showTimeScope = isDetailsDateRangeToggleEnabled ? false : true,
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
    if (groupBy?.indexOf(tagPrefix) !== -1) {
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
            groupBy: groupBy?.indexOf(tagPrefix) !== -1 ? 'tag' : groupBy,
          });

    const helpText = isExportsToggleEnabled ? this.nameValidator(defaultName) : undefined;
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
            isTimeScoped={isTimeScoped}
            items={items}
            key="confirm"
            timeScope={timeScope}
            onClose={this.handleOnClose}
            onError={this.handleOnError}
            name={defaultName}
            reportPathsType={reportPathsType}
            reportQueryString={reportQueryString}
            reportType={reportType}
            resolution={resolution}
          />,
          <Button ouiaId="cancel-btn" key="cancel" onClick={this.handleOnClose} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
      >
        {error && <Alert variant="danger" style={styles.alert} title={intl.formatMessage(messages.exportError)} />}
        <div style={styles.title}>
          {isExportsToggleEnabled ? (
            <span>
              {intl.formatMessage(messages.exportDesc, { value: <b>{intl.formatMessage(messages.exportsTitle)}</b> })}
            </span>
          ) : (
            <span>{intl.formatMessage(messages.exportHeading, { groupBy })}</span>
          )}
        </div>
        <Form style={styles.form}>
          <Grid hasGutter md={6}>
            {isExportsToggleEnabled && (
              <GridItem span={12}>
                <FormGroup fieldId="exportName" label={intl.formatMessage(messages.names, { count: 1 })} isRequired>
                  <TextInput
                    isRequired
                    type="text"
                    id="exportName"
                    name="exportName"
                    value={defaultName}
                    onChange={this.handleOnNameChange}
                    validated={validated}
                  />
                  {validated === 'error' && (
                    <HelperText>
                      <HelperTextItem variant="error">{intl.formatMessage(helpText)}</HelperTextItem>
                    </HelperText>
                  )}
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
            {showFormatType && isExportsToggleEnabled && (
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
    isDetailsDateRangeToggleEnabled: FeatureToggleSelectors.selectIsDetailsDateRangeToggleEnabled(state),
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
  };
});

const ExportModalConnect = connect(mapStateToProps, undefined)(ExportModalBase);
const ExportModal = injectIntl(ExportModalConnect);

export default ExportModal;
