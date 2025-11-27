import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
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
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  TextInput,
} from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import { orderBy } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../store/common';
import { FeatureToggleSelectors } from '../../../store/featureToggle';
import { tagPrefix } from '../../../utils/props';
import type { ComputedReportItem } from '../../utils/computedReport/getComputedReportItems';
import { styles } from './exportModal.styles';
import { ExportSubmit } from './exportSubmit';

export interface ExportModalOwnProps {
  count?: number;
  groupBy?: string;
  isAllItems?: boolean;
  isOpen: boolean;
  isTimeScoped?: boolean; // Indicates API should use time_scope_value or start and end date parameters
  items?: ComputedReportItem[];
  onClose(isOpen: boolean);
  reportPathsType: ReportPathsType;
  reportQueryString: string;
  reportType: ReportType;
  resolution?: 'daily' | 'monthly'; // Default resolution
  showAggregateType?: boolean; // Monthly resolution filters are not valid with date range
  showFormatType?: boolean; // Format type; CVS / JSON
  timeScopeValue?: number;
}

interface ExportModalStateProps {
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

export class ExportModalBase extends React.Component<ExportModalProps, ExportModalState> {
  protected defaultState: ExportModalState = {
    error: undefined,
    formatType: 'csv',
    resolution: this.props.resolution || 'monthly',
  };
  public state: ExportModalState = { ...this.defaultState };

  // Reset default state upon close -- see https://issues.redhat.com/browse/COST-1134
  private handleOnClose = () => {
    this.setState({ ...this.defaultState }, () => {
      this.props.onClose(false);
    });
  };

  private handleOnError = (error: AxiosError) => {
    this.setState({ error });
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
      isExportsToggleEnabled,
      isTimeScoped,
      items,
      reportPathsType,
      reportQueryString,
      reportType,
      showAggregateType = true,
      showFormatType = true,
      timeScopeValue,
    } = this.props;
    const { error, formatType, name, resolution } = this.state;

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
      <Modal style={styles.modal} isOpen={this.props.isOpen} onClose={this.handleOnClose} variant="small">
        <ModalHeader title={intl.formatMessage(messages.exportTitle)} />
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <ExportSubmit
            disabled={validated === 'error'}
            formatType={formatType}
            groupBy={groupBy}
            isAllItems={isAllItems}
            isTimeScoped={isTimeScoped}
            items={items}
            key="confirm"
            onClose={this.handleOnClose}
            onError={this.handleOnError}
            name={defaultName}
            reportPathsType={reportPathsType}
            reportQueryString={reportQueryString}
            reportType={reportType}
            resolution={resolution}
            timeScopeValue={timeScopeValue}
          />
          <Button ouiaId="cancel-btn" key="cancel" onClick={this.handleOnClose} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = createMapStateToProps<ExportModalOwnProps, unknown>(state => {
  return {
    isExportsToggleEnabled: FeatureToggleSelectors.selectIsExportsToggleEnabled(state),
  };
});

const ExportModalConnect = connect(mapStateToProps, undefined)(ExportModalBase);
const ExportModal = injectIntl(ExportModalConnect);

export default ExportModal;
