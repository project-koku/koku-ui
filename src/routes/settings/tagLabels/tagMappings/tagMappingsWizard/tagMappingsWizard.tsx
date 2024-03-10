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
import { ParentTags } from 'routes/settings/tagLabels/tagMappings/components/parentTags';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { styles } from './tagMappingsWizard.styles';
import { TagMappingsEmptyState } from './tagMappingsWizardEmptyState';
import { TagMappingsWizardReview } from './tagMappingsWizardReview';

interface TagMappingsWizardOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose();
}

interface TagMappingsWizardStateProps {
  settingsUpdateError?: AxiosError;
  settingsUpdateStatus?: FetchStatus;
}

type TagMappingsWizardProps = TagMappingsWizardOwnProps;

const TagMappingsWizard: React.FC<TagMappingsWizardProps> = ({
  canWrite,
  isDisabled,
  onClose,
}: TagMappingsWizardProps) => {
  const [childTags, setChildTags] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [parentTags, setParentTags] = useState([]);

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const { settingsUpdateError, settingsUpdateStatus } = useMapToProps();

  const getActions = () => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button isAriaDisabled={!canWrite || isDisabled} onClick={handleOnClick} variant={ButtonVariant.primary}>
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
            <ChildTags onBulkSelect={handleOnBulkSelect} onSelect={handleOnSelectChild} selectedItems={childTags} />
          </WizardStep>
          <WizardStep
            footer={{
              isNextDisabled: parentTags.length === 0,
            }}
            id="step-2"
            isDisabled={childTags.length === 0}
            name={intl.formatMessage(messages.tagMappingsWizardSelectParentTag)}
          >
            <ParentTags onSelect={handleOnSelectParent} selectedItems={parentTags} />
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
              parentTags={parentTags}
              settingsError={settingsUpdateError}
              settingsStatus={settingsUpdateStatus}
            />
          </WizardStep>
        </Wizard>
      </Modal>
    );
  };

  const handleOnBulkSelect = (items: SettingsData[]) => {
    setChildTags(items);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnClose = () => {
    handleOnReset();
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOnCreateTagMapping = () => {
    if (settingsUpdateStatus !== FetchStatus.inProgress) {
      dispatch(
        settingsActions.updateSettings(SettingsType.tagsMappingsChildAdd, {
          parent: parentTags.length ? parentTags[0].uuid : undefined,
          children: childTags.map(item => item.uuid),
        })
      );
    }
  };

  const handleOnReset = () => {
    setChildTags([]);
    setParentTags([]);
    setIsFinished(false);
    dispatch(settingsActions.resetSettingsState());
  };

  const handleOnSelectChild = (items: SettingsData[], isSelected: boolean = false) => {
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

  const handleOnSelectParent = (items: SettingsData[], isSelected: boolean = false) => {
    let newItems = [];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.uuid !== item.uuid);
        });
      }
    }
    setParentTags(newItems);
  };

  useEffect(() => {
    if (settingsUpdateStatus === FetchStatus.complete && !settingsUpdateError) {
      setIsFinished(true);
    }
  }, [settingsUpdateError, settingsUpdateStatus]);

  return (
    <>
      {getActions()}
      {isFinished ? getSuccessEmptyState() : getWizard()}
    </>
  );
};

const useMapToProps = (): TagMappingsWizardStateProps => {
  const settingsUpdateStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsMappingsChildAdd)
  );
  const settingsUpdateError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateError(state, SettingsType.tagsMappingsChildAdd)
  );

  return {
    settingsUpdateError,
    settingsUpdateStatus,
  };
};

export default TagMappingsWizard;
