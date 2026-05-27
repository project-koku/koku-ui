import './deleteTagMapping.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { SettingsData } from 'api/settings';
import type { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

interface DeleteTagMappingOwnProps {
  isOpen?: boolean;
  isChild?: boolean;
  item: SettingsData;
  onClose?: () => void;
  settingsType: SettingsType;
}

interface DeleteTagMappingMapProps {
  settingsType: SettingsType;
}

interface DeleteTagMappingStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type DeleteTagMappingProps = DeleteTagMappingOwnProps;

const DeleteTagMapping: React.FC<DeleteTagMappingProps> = ({ isOpen, isChild, item, onClose, settingsType }) => {
  const [isFinish, setIsFinish] = useState(false);
  const { settingsError, settingsFetchStatus } = useMapToProps({ settingsType });

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const handleOnDelete = () => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(
        settingsActions.updateSettings(settingsType, {
          ids: [item.uuid],
        })
      );
    }
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
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(isChild ? messages.tagMappingRemoveTitle : messages.tagMappingDeleteTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        {intl.formatMessage(isChild ? messages.tagMappingRemoveDesc : messages.tagMappingDeleteDesc, {
          value: <b>{item.key}</b>,
        })}
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" onClick={handleOnDelete} variant="danger">
          {intl.formatMessage(isChild ? messages.remove : messages.delete)}
        </Button>
        <Button key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = ({ settingsType }: DeleteTagMappingMapProps): DeleteTagMappingStateProps => {
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, settingsType, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, settingsType, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export default DeleteTagMapping;
