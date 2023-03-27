import { Button, Modal } from '@patternfly/react-core';
import { AxiosError } from 'axios';
import Final from 'routes/onboardingModal//final';
import AwsConfigure from 'routes/onboardingModal/awsConfigure';
import AzureCreds from 'routes/onboardingModal/azureCreds';
import AzureDataSource from 'routes/onboardingModal/azureDataSource';
import Configure from 'routes/onboardingModal/configure';
import ConfirmDialog from 'routes/onboardingModal/confirmDialog';
import EnableAccountAccess from 'routes/onboardingModal/enableAccountAccess';
import IamPolicy from 'routes/onboardingModal/iamPolicy';
import IamRole from 'routes/onboardingModal/iamRole';
import ObtainLogin from 'routes/onboardingModal/obtainLogin';
import SourceKind from 'routes/onboardingModal/sourceKind';
import UsageCollector from 'routes/onboardingModal/usageCollector';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import Merlin from 'react-merlin';
import { FetchStatus } from 'store/common';
import { onboardingActions } from 'store/onboarding';
import { sourcesActions } from 'store/sourceSettings';
import { getTestProps, testIds } from 'testIds';

interface DirtyMapType {
  name: boolean;
  type: boolean;
  clusterId: boolean;
  s3BucketName: boolean;
  arn: boolean;
  clientId: boolean;
  tenantId: boolean;
  clientSecret: boolean;
  subscriptionId: boolean;
  resourceGroup: boolean;
  storageAccount: boolean;
}

export interface Props extends InjectedTranslateProps {
  cancelOnboarding: typeof onboardingActions.displayConfirm;
  updateSources: typeof sourcesActions.fetchSources;
  addSource: typeof onboardingActions.addSource;
  isModalOpen: boolean;
  isInvalid: boolean;
  dirtyMap: DirtyMapType;
  sourceKindChecked: object;
  type: string;
  name: string;
  arn: string;
  clusterId: string;
  bucket: string;
  azureCreds: { [k: string]: { value: string } };
  azureAuth: { [k: string]: { value: string } };
  status: FetchStatus;
  errors: AxiosError;
}

const stepMap = type => {
  switch (type) {
    case 'AZURE':
      return [
        <SourceKind key="source_kind" />,
        <AzureCreds key="azure_creds" />,
        <AzureDataSource key="azure_auth" />,
        <Final key="aws_final" />,
      ];
    case 'AWS':
      return [
        <SourceKind key="source_kind" />,
        <AwsConfigure key="aws_configure" />,
        <IamPolicy key="aws_iam_policy" />,
        <IamRole key="aws_iam_role" />,
        <EnableAccountAccess key="enable_account_access" />,
        <Final key="aws_final" />,
      ];
    case 'OCP':
      return [
        <SourceKind key="source_kind" />,
        <ObtainLogin key="obtain_login" />,
        <UsageCollector key="usage_collector" />,
        <Configure key="configure" />,
        <Final key="final" />,
      ];
    default:
      return [<SourceKind key="source_kind" />];
  }
};

const dirtyStepMap = (dirtyMap, sourceKindChecked) => type => {
  switch (type) {
    case 'AZURE':
      return [
        dirtyMap.name && dirtyMap.type,
        dirtyMap.clientId &&
          dirtyMap.tenantId &&
          dirtyMap.clientSecret &&
          dirtyMap.subscriptionId,
        dirtyMap.resourceGroup && dirtyMap.storageAccount,
        true,
      ];
    case 'AWS':
      return [
        dirtyMap.name && dirtyMap.type,
        dirtyMap.s3BucketName,
        true,
        true,
        dirtyMap.arn,
        true,
      ];
    case 'OCP':
      return [
        dirtyMap.name &&
          dirtyMap.type &&
          Object.keys(sourceKindChecked).every(k => sourceKindChecked[k]),
        true,
        dirtyMap.clusterId,
        true,
        true,
      ];
    default:
      return [];
  }
};

export const WizardBase: React.SFC<Props> = ({
  t,
  cancelOnboarding,
  updateSources,
  isModalOpen,
  isInvalid,
  dirtyMap,
  sourceKindChecked,
  status,
  type,
  bucket,
  name,
  arn,
  clusterId,
  addSource,
  azureCreds,
  azureAuth,
}) => {
  const steps = stepMap(type);
  const isDirty = dirtyStepMap(dirtyMap, sourceKindChecked)(type);
  return (
    <Merlin>
      {({ index, setIndex }) => {
        if (type === '' && index !== 0) {
          setIndex(0);
        }
        const actions = [
          (type === '' || index < steps.length) && (
            <Button
              {...getTestProps(testIds.onboarding.btn_cancel)}
              key="wizard_cancel"
              variant="secondary"
              id="wizard_cancel_button"
              isDisabled={status === FetchStatus.inProgress}
              onClick={() => {
                cancelOnboarding();
              }}
            >
              {t('onboarding.wizard.cancel')}
            </Button>
          ),
          index > 0 && (
            <Button
              {...getTestProps(testIds.onboarding.btn_back)}
              key="wizard_back"
              variant="secondary"
              id="wizard_back_button"
              isDisabled={status === FetchStatus.inProgress}
              onClick={() => setIndex(index - 1)}
            >
              {t('onboarding.wizard.back')}
            </Button>
          ),
          type === '' && (
            <Button
              isDisabled
              key="wizard_init_continue"
              variant="primary"
              id="wizard_init_button"
            >
              {t('onboarding.wizard.next')}
            </Button>
          ),
          type !== '' && index < steps.length - 1 && (
            <Button
              {...getTestProps(testIds.onboarding.btn_continue)}
              isDisabled={!isDirty[index] || isInvalid}
              key="wizard_continue"
              variant="primary"
              id="wizard_continue_button"
              onClick={() => {
                setIndex(index + 1);
              }}
            >
              {t('onboarding.wizard.next')}
            </Button>
          ),
          type !== '' && index === steps.length - 1 && (
            <Button
              {...getTestProps(testIds.onboarding.btn_continue)}
              isDisabled={status === FetchStatus.inProgress}
              key="wizard_finish"
              variant="primary"
              id="wizard_finish_button"
              onClick={() => {
                const provider_resource_name =
                  type === 'OCP' ? clusterId : type === 'AWS' ? arn : null;

                let billing_source_obj = null;
                if (type === 'AWS') {
                  billing_source_obj = { billing_source: { bucket } };
                }
                if (type === 'AZURE') {
                  billing_source_obj = {
                    billing_source: {
                      data_source: {
                        resource_group: azureAuth.resourceGroup.value,
                        storage_account: azureAuth.storageAccount.value,
                      },
                    },
                  };
                }
                const credentials =
                  type === 'AZURE'
                    ? {
                        client_id: azureCreds.clientId.value,
                        tenant_id: azureCreds.tenantId.value,
                        client_secret: azureCreds.clientSecret.value,
                        subscription_id: azureCreds.subscriptionId.value,
                      }
                    : null;
                addSource({
                  type,
                  name,
                  authentication: {
                    provider_resource_name,
                    credentials,
                  },
                  ...billing_source_obj,
                });
              }}
            >
              {t('onboarding.wizard.add_source')}
            </Button>
          ),
        ];
        return (
          <>
            <ConfirmDialog />
            <Modal
              style={{
                height: '700px',
                width: '800px',
              }}
              isLarge
              title={t('onboarding.wizard.title')}
              isOpen={isModalOpen}
              actions={actions}
              onClose={() => {
                cancelOnboarding();
              }}
            >
              {steps[index]}
            </Modal>
          </>
        );
      }}
    </Merlin>
  );
};
