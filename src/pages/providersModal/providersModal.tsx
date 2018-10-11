import {
  Alert,
  AlertVariant,
  Button,
  ButtonVariant,
  Modal,
} from '@patternfly/react-core';

import { css } from '@patternfly/react-styles';
import { AxiosError } from 'axios';
import { FormGroup } from 'components/formGroup';
import { TextInput } from 'components/textInput';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';
import { uiActions, uiSelectors } from 'store/ui';
import { getTestProps, testIds } from 'testIds';
import { styles } from './providersModal.styles';

export interface Props extends InjectedTranslateProps {
  addProvider?: typeof providersActions.addProvider;
  clearProviderFailure: typeof providersActions.clearProviderFailure;
  closeProvidersModal?: typeof uiActions.closeProvidersModal;
  error?: AxiosError;
  fetchStatus?: FetchStatus;
  isProviderModalOpen?: boolean;
}

interface State {
  bucket: string;
  bucketInvalidMsg: string;
  name: string;
  nameInvalidMsg: string;
  resourceName: string;
  resourceNameInvalidMsg: string;
  type: string;
}

export class ProvidersModal extends React.Component<Props, State> {
  protected defaultState: State = {
    bucket: '',
    bucketInvalidMsg: null,
    name: '',
    nameInvalidMsg: null,
    resourceName: '',
    resourceNameInvalidMsg: null,
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
    this.props.addProvider({
      name: this.state.name,
      type: this.state.type,
      authentication: {
        provider_resource_name: this.state.resourceName,
      },
      billing_source: {
        bucket: this.state.bucket,
      },
    });
  };

  private handleCancel = () => {
    this.props.closeProvidersModal();
  };

  private handleBucketChange = (bucket: string) => {
    const { t } = this.props;
    const invalid = !new RegExp('^[a-zA-Z0-9.\\-_]{0,255}$').test(bucket);
    const bucketInvalidMsg = invalid ? t('providers.bucket_error') : null;

    this.setState(() => ({
      bucket,
      bucketInvalidMsg,
    }));
    this.props.clearProviderFailure(); // Clear previous errors when user edits input field
  };

  private handleNameChange = (name: string) => {
    const { t } = this.props;
    const invalid = !new RegExp('^.?').test(name);
    const nameInvalidMsg = invalid ? t('providers.name_error') : null;

    this.setState(() => ({
      name,
      nameInvalidMsg,
    }));
    this.props.clearProviderFailure(); // Clear previous errors when user edits input field
  };

  private handleResourceNameChange = (resourceName: string) => {
    const { t } = this.props;
    const invalid =
      resourceName.length > 0 && !new RegExp('^arn:aws:').test(resourceName);
    const resourceNameInvalidMsg = invalid
      ? t('providers.resource_name_error')
      : null;

    this.setState(() => ({
      resourceName,
      resourceNameInvalidMsg,
    }));
    this.props.clearProviderFailure(); // Clear previous errors when user edits input field
  };

  public render() {
    const { t, error } = this.props;
    const {
      bucket,
      bucketInvalidMsg,
      name,
      nameInvalidMsg,
      resourceName,
      resourceNameInvalidMsg,
    } = this.state;
    const emptyField =
      bucket.trim().length === 0 ||
      name.trim().length === 0 ||
      resourceName.trim().length === 0;
    const invalidField =
      bucketInvalidMsg !== null ||
      nameInvalidMsg !== null ||
      resourceNameInvalidMsg !== null;

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
        onClose={this.handleCancel}
        title={t('providers.add_account')}
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
              invalidField ||
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
              title={
                bucketInvalidMsg ||
                nameInvalidMsg ||
                resourceNameInvalidMsg ||
                errorMsg
              }
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
        <FormGroup label={t('providers.name_label')}>
          <TextInput
            {...getTestProps(testIds.providers.name_input)}
            autoFocus
            isError={Boolean(nameError)}
            isFlat
            onChange={this.handleNameChange}
            placeholder={'AWSHCCM'}
            value={name}
          />
        </FormGroup>
        <FormGroup label={t('providers.bucket_label')}>
          <TextInput
            {...getTestProps(testIds.providers.bucket_input)}
            isError={Boolean(bucketError || bucketInvalidMsg)}
            isFlat
            type="text"
            onChange={this.handleBucketChange}
            placeholder={'cost-usage-bucket'}
            value={bucket}
          />
        </FormGroup>
        <FormGroup label={t('providers.resource_name_label')}>
          <TextInput
            {...getTestProps(testIds.providers.resource_name_input)}
            isError={Boolean(resourceNameError || resourceNameInvalidMsg)}
            isFlat
            onChange={this.handleResourceNameChange}
            placeholder={'arn:aws:iam::589173575009:role/CostManagement'}
            value={resourceName}
          />
        </FormGroup>
      </Modal>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isProviderModalOpen: uiSelectors.selectIsProvidersModalOpen(state),
    error: providersSelectors.selectAddProviderError(state),
    fetchStatus: providersSelectors.selectAddProviderFetchStatus(state),
  })),
  {
    addProvider: providersActions.addProvider,
    clearProviderFailure: providersActions.clearProviderFailure,
    closeProvidersModal: uiActions.closeProvidersModal,
  }
)(translate()(ProvidersModal));
