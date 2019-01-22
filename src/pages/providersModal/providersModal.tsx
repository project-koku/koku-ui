import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Modal,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { AxiosError } from 'axios';
import { FormGroup } from 'components/formGroup';
import { noop } from 'patternfly-react';
import React from 'react';
import {
  InjectedTranslateProps,
  translate,
  TranslationFunction,
} from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { onboardingActions, onboardingSelectors } from 'store/onboarding';
import { providersActions, providersSelectors } from 'store/providers';
import { getTestProps, testIds } from 'testIds';
import AttributeField, { AttributeProps } from './attributeField';
import { styles } from './providersModal.styles';

export interface Props extends InjectedTranslateProps {
  addProvider?: typeof providersActions.addProvider;
  clearProviderFailure: typeof providersActions.clearProviderFailure;
  closeProvidersModal?: typeof onboardingActions.closeModal;
  cancelProvidersModal?: typeof onboardingActions.cancelOnboarding;
  error?: AxiosError;
  fetchStatus?: FetchStatus;
  isProviderModalOpen?: boolean;
}

type Attribute = AttributeProps & { id: string };

interface State {
  bucket: Attribute;
  name: Attribute;
  resourceName: Attribute;
  clusterID: Attribute;
  type: string;
}

const validator = {
  name: (value: string, t: TranslationFunction) =>
    !new RegExp('^.?').test(value) ? t('providers.name_error') : null,
  bucket: (value: string, t: TranslationFunction) =>
    !new RegExp('^[a-zA-Z0-9.\\-_]{0,255}$').test(value)
      ? t('providers.bucket_error')
      : null,
  resourceName: (value: string, t: TranslationFunction) =>
    !new RegExp('^arn:aws:').test(value)
      ? t('providers.resource_name_error')
      : null,
  clusterID: (value: string, t: TranslationFunction) =>
    !new RegExp('^.?').test(value) ? t('providers.name_error') : null,
};

export class ProvidersModal extends React.Component<Props, State> {
  protected defaultState: State = {
    name: {
      id: 'name',
      label: 'providers.name_label',
      placeholder: 'HCCM',
      testProps: getTestProps(testIds.providers.name_input),
      value: '',
      error: null,
      autoFocus: true,
    },
    bucket: {
      id: 'bucket',
      label: 'providers.bucket_label',
      placeholder: 'cost-usage-bucket',
      testProps: getTestProps(testIds.providers.bucket_input),
      value: '',
      error: null,
    },
    resourceName: {
      id: 'resourceName',
      label: 'providers.resource_name_label',
      testProps: getTestProps(testIds.providers.resource_name_input),
      placeholder: 'arn:aws:iam::589173575009:role/CostManagement',
      value: '',
      error: null,
    },
    clusterID: {
      id: 'clusterID',
      label: 'providers.cluster_id_label',
      testProps: getTestProps(testIds.providers.cluster_id_input),
      placeholder: 'OCP-CostManagement',
      value: '',
      error: null,
    },
    type: 'AWS',
  };
  public state: State = { ...this.defaultState };

  public componentDidUpdate(prevProps: Props) {
    const { isProviderModalOpen } = this.props;
    if (isProviderModalOpen && !prevProps.isProviderModalOpen) {
      this.setState({ ...this.defaultState });
    }
  }

  private handleAddProvider = () => {
    switch (this.state.type) {
      case 'AWS':
        return this.props.addProvider({
          name: this.state.name.value,
          type: this.state.type,
          authentication: {
            provider_resource_name: this.state.resourceName.value,
          },
          billing_source: {
            bucket: this.state.bucket.value,
          },
        });
      case 'OCP':
        return this.props.addProvider({
          name: this.state.name.value,
          type: this.state.type,
          authentication: {
            provider_resource_name: this.state.clusterID.value,
          },
        });
    }
  };

  private handleCancel = () => {
    this.props.closeProvidersModal();
  };

  private handleChange = (
    validatorFnc: (value: string, t: TranslationFunction) => string,
    attribute: Attribute
  ) => (value: string) => {
    const { t } = this.props;
    this.setState(() => ({
      ...this.state,
      [attribute.id]: { ...attribute, value, error: validatorFnc(value, t) },
    }));
    this.props.clearProviderFailure(); // Clear previous errors when user edits input field
  };

  private handleSelect = value => {
    this.setState({
      ...this.defaultState,
      type: value,
    });
    this.props.clearProviderFailure(); // Clear previous errors when user edits input field
  };

  private attributes = () => {
    switch (this.state.type) {
      case 'AWS':
        return [this.state.name, this.state.bucket, this.state.resourceName];
      case 'OCP':
        return [this.state.name, this.state.clusterID];
      default:
        return [];
    }
  };

  public render() {
    const { t, error } = this.props;
    const emptyField = this.attributes().some(
      attr => attr.value.trim().length === 0
    );
    const invalidField = this.attributes().find(attr => attr.error !== null);
    const bucketError =
      error &&
      error.response &&
      (error.response.data.bucket || error.response.data.billing_source);
    const nameError = error && error.response && error.response.data.name;
    const resourceNameError =
      error &&
      error.response &&
      (error.response.data.provider_resource_name ||
        error.response.data.authentication);

    let errorMsg = t('providers.default_error');
    if (bucketError) {
      errorMsg =
        error.response.data.bucket || error.response.data.billing_source.bucket;
    } else if (nameError) {
      errorMsg = error.response.data.name;
    } else if (resourceNameError) {
      errorMsg =
        error.response.data.provider_resource_name ||
        error.response.data.authentication.provider_resource_name;
    }

    return (
      <Modal
        className={css(styles.modal)}
        isLarge
        isOpen={this.props.isProviderModalOpen}
        onClose={this.props.cancelProvidersModal}
        title={t('providers.add_source')}
        actions={[
          <Button
            {...getTestProps(testIds.providers.cancel_btn)}
            key="cancel"
            onClick={this.handleCancel}
            variant={ButtonVariant.secondary}
          >
            {t('providers.cancel')}
          </Button>,
          <Button
            {...getTestProps(testIds.providers.submit_btn)}
            key="confirm"
            isDisabled={
              emptyField ||
              Boolean(invalidField) ||
              this.props.fetchStatus === FetchStatus.inProgress
            }
            onClick={this.handleAddProvider}
            variant={ButtonVariant.primary}
          >
            {t('providers.confirm')}
          </Button>,
        ]}
      >
        {Boolean(error || invalidField) && (
          <div className={css(styles.alert)}>
            <Alert
              {...getTestProps(testIds.login.alert)}
              variant={AlertVariant.danger}
              title={(invalidField && invalidField.error) || errorMsg}
            />
          </div>
        )}
        <p className={css(styles.docs)}>
          View the{' '}
          <a
            href="https://koku.readthedocs.io/en/latest/providers.html#adding-an-aws-account"
            target="_blank"
          >
            Koku documentation
          </a>{' '}
          and learn how to configure your AWS account to allow Koku access.
        </p>
        <FormGroup label={t('providers.type_label')}>
          <Select
            value={this.state.type}
            aria-label="provider type selector"
            onBlur={noop}
            onFocus={noop}
            onChange={this.handleSelect}
          >
            <SelectOption label="AWS" value="AWS" />
            <SelectOption label="OCP" value="OCP" />
          </Select>
        </FormGroup>
        {this.attributes().map(attr => (
          <AttributeField
            key={`attribute-field-${attr.id}`}
            value={attr.value}
            label={t(attr.label)}
            testProps={attr.testProps}
            placeholder={attr.placeholder}
            error={attr.error}
            onChange={this.handleChange(validator[attr.id], attr)}
          />
        ))}
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isProviderModalOpen: onboardingSelectors.selectOnboardingModal(state),
    error: providersSelectors.selectAddProviderError(state),
    fetchStatus: providersSelectors.selectAddProviderFetchStatus(state),
  })),
  {
    addProvider: providersActions.addProvider,
    clearProviderFailure: providersActions.clearProviderFailure,
    closeProvidersModal: onboardingActions.closeModal,
    cancelProvidersModal: onboardingActions.cancelOnboarding,
  }
)(translate()(ProvidersModal));
