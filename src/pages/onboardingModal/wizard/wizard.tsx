import { Button, Modal } from '@patternfly/react-core';
import Final from 'pages/onboardingModal//final';
import AwsConfigure from 'pages/onboardingModal/awsConfigure';
import Configure from 'pages/onboardingModal/configure';
import EnableAccountAccess from 'pages/onboardingModal/enableAccountAccess';
import IamPolicy from 'pages/onboardingModal/iamPolicy';
import IamRole from 'pages/onboardingModal/iamRole';
import ObtainLogin from 'pages/onboardingModal/obtainLogin';
import SourceKind from 'pages/onboardingModal/sourceKind';
import UsageCollector from 'pages/onboardingModal/usageCollector';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import Merlin from 'react-merlin';
import { onboardingActions } from 'store/onboarding';
import { getTestProps, testIds } from 'testIds';

interface DirtyMapType {
  name: boolean;
  type: boolean;
  clusterId: boolean;
  s3BucketName: boolean;
  arn: boolean;
}

export interface Props extends InjectedTranslateProps {
  closeModal: typeof onboardingActions.closeModal;
  cancelOnboarding: typeof onboardingActions.cancelOnboarding;
  isModalOpen: boolean;
  isInvalid: boolean;
  dirtyMap: DirtyMapType;
  sourceKindChecked: object;
  type: string;
}

const stepMap = type => {
  switch (type) {
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
  closeModal,
  cancelOnboarding,
  isModalOpen,
  isInvalid,
  dirtyMap,
  sourceKindChecked,
  type,
}) => {
  const steps = stepMap(type);
  const isDirty = dirtyStepMap(dirtyMap, sourceKindChecked)(type);
  return (
    <Merlin>
      {({ index, setIndex }) => {
        const actions = [
          (type === '' || index < steps.length - 1) && (
            <Button
              {...getTestProps(testIds.onboarding.btn_cancel)}
              key="wizard_cancel"
              variant="secondary"
              id="wizard_cancel_button"
              onClick={() => {
                setIndex(0);
                cancelOnboarding();
              }}
            >
              Cancel
            </Button>
          ),
          index > 0 && index < steps.length - 1 && (
            <Button
              {...getTestProps(testIds.onboarding.btn_back)}
              key="wizard_back"
              variant="secondary"
              id="wizard_back_button"
              onClick={() => setIndex(index - 1)}
            >
              Back
            </Button>
          ),
          type === '' && (
            <Button
              isDisabled
              key="wizard_init_continue"
              variant="primary"
              id="wizard_init_button"
            >
              Continue
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
              {index + 2 === steps.length ? 'Finish' : 'Continue'}
            </Button>
          ),
          type !== '' && index + 1 === steps.length && (
            <Button
              {...getTestProps(testIds.onboarding.btn_close)}
              key="wizard_close"
              variant="primary"
              id="wizard_close_button"
              onClick={() => {
                setIndex(0);
                cancelOnboarding();
              }}
            >
              Close
            </Button>
          ),
        ];
        return (
          <Modal
            style={{
              height: '700px',
              width: '800px',
            }}
            isLarge
            title={t('onboarding.wizard.title')}
            isOpen={isModalOpen}
            actions={actions}
            onClose={closeModal}
          >
            {steps[index]}
          </Modal>
        );
      }}
    </Merlin>
  );
};
