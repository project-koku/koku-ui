import { Alert, Button, ButtonVariant, Tooltip, Wizard, WizardHeader, WizardStep } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/next';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { styles } from './tagMappingsWizard.styles';
import { TagMappingsEmptyState } from './tagMappingsWizardEmptyState';

interface tagMappingsModalOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

type tagMappingsModalProps = tagMappingsModalOwnProps;

const TagMappingsWizard: React.FC<tagMappingsModalProps> = ({ canWrite, isDisabled }: tagMappingsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  // const { goToStepById } = useWizardContext();
  const intl = useIntl();

  const getActions = () => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button isAriaDisabled={isDisabled} onClick={handleOnClick} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.createTagMapping)}
      </Button>
    );
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  const getSuccessState = () => {
    return (
      <Modal className="costManagement" isOpen={isOpen} variant={ModalVariant.medium}>
        <div className="pf-v5-c-wizard">
          <WizardHeader
            description={intl.formatMessage(messages.tagMappingsWizardDesc)}
            onClose={handleOnClose}
            title={intl.formatMessage(messages.createTagMapping)}
          />
          <div style={styles.emptyState}>
            <TagMappingsEmptyState
              onNavToTagMappings={handleOnNavToTagMappings}
              onNavToCreateTagMapping={handleOnNavToCreateTagMapping}
            />
          </div>
        </div>
      </Modal>
    );
  };

  const getWizard = () => {
    return (
      <Modal className="costManagement" isOpen={isOpen} variant={ModalVariant.medium}>
        <Wizard
          header={
            <WizardHeader
              description={intl.formatMessage(messages.tagMappingsWizardDesc)}
              onClose={handleOnClose}
              title={intl.formatMessage(messages.createTagMapping)}
            />
          }
          isVisitRequired
          onClose={handleOnClose}
        >
          <WizardStep id="step-1" name={intl.formatMessage(messages.tagMappingsWizardSelectChildTags)}>
            Step 1 content
          </WizardStep>
          <WizardStep id="step-2" name={intl.formatMessage(messages.tagMappingsWizardSelectParentTag)}>
            Step 2 content
          </WizardStep>
          <WizardStep
            id="step-3"
            name={intl.formatMessage(messages.tagMappingsWizardReview)}
            footer={{
              nextButtonText: intl.formatMessage(messages.createTagMapping),
              onNext: handleOnCreateTagMapping,
            }}
          >
            <Alert style={styles.alert} title={`Error: TBD...`} variant="danger" />
            Review step content
          </WizardStep>
        </Wizard>
      </Modal>
    );
  };

  const handleOnClose = () => {
    setIsOpen(false);
    setIsFinish(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnCreateTagMapping = () => {
    setIsFinish(true);
  };

  const handleOnNavToCreateTagMapping = () => {
    setIsFinish(false);
  };

  const handleOnNavToTagMappings = () => {
    handleOnClose();
  };

  return (
    <>
      {getActions()}
      {isFinish ? getSuccessState() : getWizard()}
    </>
  );
};

export default TagMappingsWizard;
