import Wizard from '@data-driven-forms/common/wizard';
import WizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import {
  ActionList,
  ActionListGroup,
  ActionListItem,
  Button,
  ButtonVariant,
  WizardBody,
  WizardFooterWrapper,
  WizardNav,
  WizardNavItem,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import formStyles from '@patternfly/react-styles/css/components/Form/form';
import styles from '@patternfly/react-styles/css/components/Wizard/wizard';
import { messages } from 'i18n/messages';
import React, { useCallback, useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';

interface NavSchemaItem {
  name: string;
  title?: string;
  [key: string]: unknown;
}

const getStepLabel = (step: NavSchemaItem | string): string =>
  typeof step === 'string' ? step : step.title || step.name || '';

const PF6WizardRenderer: React.FC = () => {
  const intl = useIntl();
  const {
    formOptions,
    currentStep,
    handlePrev,
    handleNext,
    navSchema,
    activeStepIndex,
    selectNext,
    conditionalSubmitFlag,
    jumpToStep,
  } = useContext(WizardContext as React.Context<any>);

  const isLastStep = activeStepIndex >= navSchema.length - 1;
  const nextStepName = currentStep?.nextStep ? selectNext?.(currentStep.nextStep, formOptions.getState) : undefined;
  const isSubmitStep = nextStepName === conditionalSubmitFlag;

  const onNext = useCallback(() => {
    if (isLastStep || isSubmitStep) {
      formOptions.handleSubmit?.();
    } else {
      handleNext(nextStepName);
    }
  }, [isLastStep, isSubmitStep, formOptions, handleNext, nextStepName]);

  const onBack = useCallback(() => {
    handlePrev();
  }, [handlePrev]);

  const steps = useMemo(() => {
    return (navSchema || []).map((step: NavSchemaItem | string, index: number) => ({
      id: typeof step === 'string' ? step : step.name,
      label: getStepLabel(step),
      index,
      isDisabled: index > activeStepIndex,
    }));
  }, [navSchema, activeStepIndex]);

  const handleNavClick = useCallback(
    (index: number) => {
      if (index <= activeStepIndex && jumpToStep) {
        jumpToStep(index);
      }
    },
    [activeStepIndex, jumpToStep]
  );

  if (!currentStep) {
    return null;
  }

  return (
    <div className={css(styles.wizard)} style={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
      <div className={css(styles.wizardOuterWrap)}>
        <div className={css(styles.wizardInnerWrap)}>
          <WizardNav aria-label={intl.formatMessage(messages.wizardNavStepsAria)} isExpanded>
            {steps.map(step => (
              <WizardNavItem
                key={step.id}
                id={step.id}
                content={step.label}
                isCurrent={step.index === activeStepIndex}
                isDisabled={step.isDisabled}
                stepIndex={step.index}
                onClick={(_, idx) => handleNavClick(idx)}
              />
            ))}
          </WizardNav>
          <main className={css(styles.wizardMain)}>
            <WizardBody>
              <h2 className={css(styles.wizardTitleText)} style={{ marginBottom: '1rem' }}>
                {currentStep.title || currentStep.name}
              </h2>
              <div className={css(formStyles.form)}>
                {currentStep.fields && formOptions.renderForm(currentStep.fields)}
              </div>
            </WizardBody>
          </main>
        </div>
        <WizardFooterWrapper>
          <ActionList>
            <ActionListGroup>
              <ActionListItem>
                <Button variant={ButtonVariant.primary} onClick={onNext} isDisabled={!formOptions.valid}>
                  {isLastStep || isSubmitStep ? 'Submit' : 'Next'}
                </Button>
              </ActionListItem>
              <ActionListItem>
                <Button variant={ButtonVariant.secondary} onClick={onBack} isDisabled={activeStepIndex === 0}>
                  Back
                </Button>
              </ActionListItem>
            </ActionListGroup>
            <ActionListGroup>
              <ActionListItem>
                <Button variant={ButtonVariant.link} onClick={formOptions.onCancel}>
                  Cancel
                </Button>
              </ActionListItem>
            </ActionListGroup>
          </ActionList>
        </WizardFooterWrapper>
      </div>
    </div>
  );
};

PF6WizardRenderer.displayName = 'PF6WizardRenderer';

export const WizardMapper: React.FC<any> = props => {
  return <Wizard Wizard={PF6WizardRenderer} {...props} />;
};

WizardMapper.displayName = 'WizardMapper';
