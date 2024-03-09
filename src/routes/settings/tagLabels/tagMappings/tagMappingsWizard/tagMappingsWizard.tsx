import { Button, ButtonVariant, Tooltip, Wizard, WizardHeader, WizardStep } from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/next';
import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { ChildTags } from 'routes/settings/tagLabels/tagMappings/components/childTags';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { styles } from './tagMappingsWizard.styles';
import { TagMappingsEmptyState } from './tagMappingsWizardEmptyState';
import { TagMappingsWizardReview } from './tagMappingsWizardReview';

interface TagMappingsWizardOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

interface TagMappingsWizardStateProps {
  settingsError?: AxiosError;
  settingsStatus?: FetchStatus;
}

type TagMappingsWizardProps = TagMappingsWizardOwnProps;

const TagMappingsWizard: React.FC<TagMappingsWizardProps> = ({ canWrite, isDisabled }: TagMappingsWizardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [childTags, setChildTags] = useState([]);
  const [parentTag] = useState('test');

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const { settingsError, settingsStatus } = useMapToProps();

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

  const getSuccessEmptyState = () => {
    return (
      <Modal className="costManagement" isOpen={isOpen} variant={ModalVariant.medium}>
        <div className="pf-v5-c-wizard">
          <WizardHeader
            description={intl.formatMessage(messages.tagMappingsWizardDesc)}
            onClose={handleOnClose}
            title={intl.formatMessage(messages.createTagMapping)}
          />
          <div style={styles.emptyState}>
            <TagMappingsEmptyState onClose={handleOnClose} onReset={handleOnReset} />
          </div>
        </div>
      </Modal>
    );
  };

  const handleOnBulkSelect = (items: SettingsData[]) => {
    setChildTags(items);
  };

  const handleOnSelect = (items: SettingsData[], isSelected: boolean = false) => {
    let newItems = [...childTags];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.uuid !== item.uuid);
        });
      }
    }
    setChildTags(newItems);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  const getWizard = () => {
    return (
      <Modal className="costManagement" isOpen={isOpen} variant={ModalVariant.large}>
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
          <WizardStep
            footer={{
              isNextDisabled: childTags.length === 0,
            }}
            id="step-1"
            name={intl.formatMessage(messages.tagMappingsWizardSelectChildTags)}
          >
            <ChildTags onBulkSelect={handleOnBulkSelect} onSelect={handleOnSelect} selectedItems={childTags} />
          </WizardStep>
          <WizardStep
            footer={{
              isNextDisabled: !parentTag,
            }}
            id="step-2"
            isDisabled={childTags.length === 0}
            name={intl.formatMessage(messages.tagMappingsWizardSelectParentTag)}
          >
            Step 2 content
          </WizardStep>
          <WizardStep
            footer={{
              nextButtonText: intl.formatMessage(messages.createTagMapping),
              onNext: handleOnCreateTagMapping,
            }}
            id="step-3"
            isDisabled={childTags.length === 0}
            name={intl.formatMessage(messages.tagMappingsWizardReview)}
          >
            <TagMappingsWizardReview
              childTags={childTags}
              parentTag={parentTag}
              settingsError={settingsError}
              settingsStatus={settingsStatus}
            />
          </WizardStep>
        </Wizard>
      </Modal>
    );
  };

  const handleOnClose = () => {
    setIsOpen(false);
    setIsFinished(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnCreateTagMapping = () => {
    if (settingsStatus !== FetchStatus.inProgress) {
      dispatch(
        settingsActions.updateSettings(SettingsType.tagsMappingsChildAdd, {
          parent: parentTag,
          children: childTags.map(item => item.uuid),
        })
      );
    }
  };

  const handleOnReset = () => {
    setIsFinished(false);
  };

  useEffect(() => {
    if (settingsStatus === FetchStatus.complete && !settingsError) {
      setIsFinished(true);
    }
  }, [settingsError, settingsStatus]);

  return (
    <>
      {getActions()}
      {isFinished ? getSuccessEmptyState() : getWizard()}
    </>
  );
};

const useMapToProps = (): TagMappingsWizardStateProps => {
  const settingsStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsMappingsChildAdd)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateError(state, SettingsType.tagsMappingsChildAdd)
  );

  return {
    settingsError,
    settingsStatus,
  };
};

export default TagMappingsWizard;
