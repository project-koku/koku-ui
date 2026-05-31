import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { parseApiError } from 'routes/settings/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { ChildTags } from '../childTags';
import { styles } from './childTagMapping.styles';

interface ChildTagMappingOwnProps {
  isOpen?: boolean;
  item: SettingsData;
  onClose();
}

interface ChildTagMappingStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type ChildTagMappingProps = ChildTagMappingOwnProps;

const ChildTagMapping: React.FC<ChildTagMappingProps> = ({ isOpen, item: parent, onClose }) => {
  const [childTags, setChildTags] = useState([]);
  const [isFinish, setIsFinish] = useState(false);
  const { settingsError, settingsFetchStatus } = useMapToProps();

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const handleOnBulkSelect = (items: SettingsData[]) => {
    setChildTags(items);
  };

  const handleOnCreateTagMapping = () => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(
        settingsActions.updateSettings(SettingsType.tagsMappingsChildAdd, {
          parent: parent.uuid,
          children: childTags.map(child => child.uuid),
        })
      );
    }
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

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete && !settingsError) {
      onClose();
    }
  }, [isFinish, settingsError, settingsFetchStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.tagMappingAddChildTags)} />
      <ModalBody>
        {settingsFetchStatus === FetchStatus.complete && settingsError && (
          <div style={styles.alertContainer}>
            <Alert
              style={styles.alert}
              title={settingsError ? parseApiError(settingsError) : undefined}
              variant="danger"
            />
          </div>
        )}
        <div>{intl.formatMessage(messages.tagMappingAddChildTagsDesc, { value: <b>{parent.key}</b> })}</div>
        <ChildTags onBulkSelect={handleOnBulkSelect} onSelect={handleOnSelect} selectedItems={childTags} />
      </ModalBody>
      <ModalFooter>
        <Button isDisabled={childTags.length === 0} key="confirm" onClick={handleOnCreateTagMapping} variant="primary">
          {intl.formatMessage(messages.tagMappingAddChildTags)}
        </Button>
        <Button key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): ChildTagMappingStateProps => {
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.tagsMappingsChildAdd, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.tagsMappingsChildAdd, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export default ChildTagMapping;
