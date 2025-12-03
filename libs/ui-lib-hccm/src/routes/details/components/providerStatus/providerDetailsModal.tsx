import type { ProviderType } from '@koku-ui/api/providers';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';

import type { RootState } from '../../../../store';
import { uiActions, uiSelectors } from '../../../../store/ui';
import { OverallStatus } from './components/overallStatus';
import { ProviderDetailsContent } from './providerDetailsContent';
import { styles } from './providerStatus.styles';

interface ProviderDetailsModalOwnProps {
  providerType: ProviderType;
}

interface ProviderDetailsModalStateProps {
  isOpen?: boolean;
}

type ProviderDetailsModalProps = ProviderDetailsModalOwnProps;

const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({ providerType }: ProviderDetailsModalProps) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const intl = useIntl();
  const [title, setTitle] = useState(messages.integrationsStatus);
  const [variant, setVariant] = useState(ModalVariant.large);
  const { isOpen } = useMapToProps();

  const resetModal = () => {
    setTitle(messages.integrationsStatus);
    setVariant(ModalVariant.large);
  };

  const handleOnClose = () => {
    resetModal();
    dispatch(uiActions.closeProvidersModal());
  };

  const handleOnClick = () => {
    resetModal();
    dispatch(uiActions.openProvidersModal());
  };

  const handleOnBackClick = () => {
    resetModal();
  };

  const handleOnDetailsClick = () => {
    setTitle(messages.integrationsDetails);
    setVariant(ModalVariant.small);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      <span style={styles.statusLabel}>{intl.formatMessage(messages.integrationsStatus)}</span>
      <OverallStatus providerType={providerType} />
      <Button onClick={handleOnClick} style={styles.dataDetailsButton} variant={ButtonVariant.link}>
        {intl.formatMessage(messages.viewAll)}
      </Button>
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={variant}>
        <ModalHeader title={intl.formatMessage(title)} />
        <ModalBody>
          <ProviderDetailsContent
            onBackClick={handleOnBackClick}
            onDetailsClick={handleOnDetailsClick}
            providerType={providerType}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

const useMapToProps = (): ProviderDetailsModalStateProps => {
  return {
    isOpen: useSelector((state: RootState) => uiSelectors.selectIsProvidersModalOpen(state)),
  };
};

export { ProviderDetailsModal };
