import { Button, Modal } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import Merlin from 'react-merlin';
import { onboardingActions } from 'store/onboarding';
import Configure from '../configure';
import Final from '../final';
import ObtainLogin from '../obtainLogin';
import SourceKind from '../sourceKind';
import UsageCollector from '../usageCollector';

interface DirtyMapType {
  name: boolean;
  type: boolean;
  clusterId: boolean;
}

export interface Props extends InjectedTranslateProps {
  closeModal: typeof onboardingActions.closeModal;
  cancelOnboarding: typeof onboardingActions.cancelOnboarding;
  isModalOpen: boolean;
  isInvalid: boolean;
  dirtyMap: DirtyMapType;
  sourceKindChecked: object;
}

const steps = [
  <SourceKind key="source_kind" />,
  <ObtainLogin key="obtain_login" />,
  <UsageCollector key="usage_collector" />,
  <Configure key="configure" />,
  <Final key="final" />,
];

export const WizardBase: React.SFC<Props> = ({
  t,
  closeModal,
  cancelOnboarding,
  isModalOpen,
  isInvalid,
  dirtyMap,
  sourceKindChecked,
}) => {
  return (
    <Merlin>
      {({ index, setIndex }) => {
        const isDirty = [
          dirtyMap.name &&
            dirtyMap.type &&
            Object.keys(sourceKindChecked).every(k => sourceKindChecked[k]),
          true,
          dirtyMap.clusterId,
          true,
          true,
        ];
        const actions = [
          index < steps.length - 1 && (
            <Button
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
              key="wizard_back"
              variant="secondary"
              id="wizard_cancel_button"
              onClick={() => setIndex(index - 1)}
            >
              Back
            </Button>
          ),
          index < steps.length - 1 && (
            <Button
              isDisabled={!isDirty[index] || isInvalid}
              key="wizard_continue"
              variant="primary"
              id="wizard_continue_button"
              onClick={() => {
                setIndex(index + 1);
              }}
            >
              {'Continue'}
            </Button>
          ),
          index + 1 === steps.length && (
            <Button
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
