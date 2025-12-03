import type { SettingsData } from '@koku-ui/api/settings';
import { SettingsType } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
  Title,
  TitleSizes,
  Tooltip,
  Wizard,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../../../../store';
import { FetchStatus } from '../../../../../../store/common';
import { settingsActions, settingsSelectors } from '../../../../../../store/settings';
import { ChildTags } from '../childTags';
import { ParentTags } from '../parentTags';
import { styles } from './parentTagMapping.styles';
import { ParentTagMappingEmptyState } from './parentTagMappingEmptyState';
import { ParentTagMappingReview } from './parentTagMappingReview';

interface ParentTagMappingOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
}

interface ParentTagMappingStateProps {
  settingsUpdateError?: AxiosError;
  settingsUpdateStatus?: FetchStatus;
}

type ParentTagMappingProps = ParentTagMappingOwnProps;

const ParentTagMapping: React.FC<ParentTagMappingProps> = ({
  canWrite,
  isDisabled,
  onClose,
}: ParentTagMappingProps) => {
  const [childTags, setChildTags] = useState([]);
  const [isFinish, setIsFinish] = useState(false);
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
        <div className="pf-v6-c-wizard">
          <WizardHeader
            description={intl.formatMessage(messages.tagMappingWizardDesc)}
            onClose={handleOnClose}
            title={intl.formatMessage(messages.createTagMapping)}
          />
          <div style={styles.emptyState}>
            <ParentTagMappingEmptyState onClose={handleOnClose} onReset={handleOnReset} />
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
              description={intl.formatMessage(messages.tagMappingWizardDesc)}
              onClose={handleOnClose}
              title={intl.formatMessage(messages.createTagMapping)}
            />
          }
          isVisitRequired
          onClose={handleOnClose}
        >
          <WizardStep
            footer={{
              isNextDisabled: parentTags.length === 0,
            }}
            id="step-1"
            name={intl.formatMessage(messages.tagMappingWizardSelectParentTag)}
          >
            <Title headingLevel="h2" size={TitleSizes.xl}>
              {intl.formatMessage(messages.tagMappingSelectParentTags)}
            </Title>
            <div style={styles.descContainer}>
              {intl.formatMessage(messages.tagMappingSelectParentTagsDesc, { count: <b>{childTags.length}</b> })}
            </div>
            <ParentTags
              onBulkSelect={handleOnBulkSelectParent}
              onSelect={handleOnSelectParent}
              selectedItems={parentTags}
              unavailableItems={childTags}
            />
          </WizardStep>
          <WizardStep
            footer={{
              isNextDisabled: childTags.length === 0,
            }}
            id="step-2"
            isDisabled={parentTags.length === 0}
            name={intl.formatMessage(messages.tagMappingWizardSelectChildTags)}
          >
            <Title headingLevel="h2" size={TitleSizes.xl}>
              {intl.formatMessage(messages.tagMappingSelectChildTags)}
            </Title>
            <div style={styles.descContainer}>
              {intl.formatMessage(messages.tagMappingSelectChildTagsDesc, {
                learnMore: (
                  <a href={intl.formatMessage(messages.docsTagMapping)} rel="noreferrer" target="_blank">
                    {intl.formatMessage(messages.learnMore)}
                  </a>
                ),
              })}
            </div>
            <ChildTags
              onBulkSelect={handleOnBulkSelectChild}
              onSelect={handleOnSelectChild}
              selectedItems={childTags}
              unavailableItems={parentTags}
            />
          </WizardStep>
          <WizardStep
            footer={{
              nextButtonText: intl.formatMessage(messages.createTagMapping),
              onNext: handleOnCreateTagMapping,
            }}
            id="step-3"
            isDisabled={childTags.length === 0}
            name={intl.formatMessage(messages.tagMappingWizardReview)}
          >
            <ParentTagMappingReview
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

  const handleOnBulkSelectChild = (items: SettingsData[]) => {
    setChildTags(items);
  };

  const handleOnBulkSelectParent = (items: SettingsData[]) => {
    setParentTags(items);
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
    setIsFinish(false);
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
    if (isOpen && settingsUpdateStatus === FetchStatus.complete && !settingsUpdateError) {
      setIsFinish(true);
    }
  }, [settingsUpdateError, settingsUpdateStatus]);

  // Clear error state if tags changed
  useEffect(() => {
    if (settingsUpdateError) {
      dispatch(settingsActions.resetStatus());
    }
  }, [childTags, parentTags]);

  return (
    <>
      {getActions()}
      {isFinish ? getSuccessEmptyState() : getWizard()}
    </>
  );
};

const useMapToProps = (): ParentTagMappingStateProps => {
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

export default ParentTagMapping;
