import './deleteModal.scss';

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
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

interface deleteModalOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onDelete();
}

export interface DeleteModalStateProps {
  settingsUpdateError?: AxiosError;
  settingsUpdateStatus?: FetchStatus;
}

type DeleteModalProps = deleteModalOwnProps;

const DeleteModal: React.FC<DeleteModalProps> = ({ canWrite, isDisabled, item, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settingsUpdateError, settingsUpdateStatus } = useMapToProps();

  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
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
      <Button
        aria-label={intl.formatMessage(messages.delete)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnClick()}
        size="sm"
        variant={ButtonVariant.plain}
      >
        <MinusCircleIcon />
      </Button>
    );
  };

  const handleOnDelete = () => {
    if (settingsUpdateStatus !== FetchStatus.inProgress) {
      dispatch(
        settingsActions.updateSettings(SettingsType.tagsMappingsChildRemove, {
          ids: [item.uuid],
        })
      );
    }
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (settingsUpdateStatus === FetchStatus.complete && !settingsUpdateError) {
      onDelete();
    }
  }, [settingsUpdateError, settingsUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {getActions()}
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.medium}>
        <ModalHeader
          className="iconOverride"
          title={intl.formatMessage(messages.tagMappingsDelete)}
          titleIconVariant="warning"
        />
        <ModalBody>{intl.formatMessage(messages.tagMappingsDeleteDesc, { value: <b>{item.key}</b> })}</ModalBody>
        <ModalFooter>
          <Button key="confirm" onClick={handleOnDelete} variant="danger">
            {intl.formatMessage(messages.tagMappingsDelete)}
          </Button>
          <Button key="cancel" onClick={handleOnClose} variant="link">
            {intl.formatMessage(messages.cancel)}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

// eslint-disable-next-line no-empty-pattern
const useMapToProps = (): DeleteModalStateProps => {
  const settingsUpdateStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateStatus(state, SettingsType.tagsMappingsChildRemove)
  );
  const settingsUpdateError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsUpdateError(state, SettingsType.tagsMappingsChildRemove)
  );

  return {
    settingsUpdateError,
    settingsUpdateStatus,
  };
};

export default DeleteModal;
