import {
  Alert,
  Button,
  Checkbox,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import type { Source } from 'apis/models/sources';
import { SourcesService } from 'apis/sources-service';
import { messages } from 'i18n/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface SourceRemoveModalProps {
  isOpen: boolean;
  source: Source;
  onClose: () => void;
  onSuccess: () => void;
}

export const SourceRemoveModal: React.FC<SourceRemoveModalProps> = ({ isOpen, source, onClose, onSuccess }) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAcknowledged(false);
      setError(null);
    }
  }, [isOpen]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await SourcesService.deleteSource(source.uuid);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : intl.formatMessage(messages.removeIntegrationGenericError));
    } finally {
      setIsDeleting(false);
    }
  }, [source.uuid, onSuccess, onClose, intl]);

  const removeDisabled = isDeleting || !acknowledged;

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small">
      <ModalHeader title={intl.formatMessage(messages.removeIntegrationModalTitle)} titleIconVariant="warning" />
      <ModalBody>
        {error && <Alert variant="danger" title={error} isInline style={{ marginBottom: '16px' }} />}
        <Stack hasGutter>
          <StackItem>
            <FormattedMessage
              {...messages.removeIntegrationModalBody}
              values={{ name: <strong>{source.name}</strong> }}
            />
          </StackItem>
          <StackItem>
            <List isPlain>
              <ListItem>
                <strong>{intl.formatMessage(messages.removeIntegrationConnectedCostManagement)}</strong>
              </ListItem>
            </List>
          </StackItem>
          <StackItem>
            <Checkbox
              id="remove-integration-acknowledge"
              label={intl.formatMessage(messages.removeIntegrationAcknowledge)}
              isChecked={acknowledged}
              onChange={(_event, checked) => setAcknowledged(checked)}
              isDisabled={isDeleting}
            />
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} isDisabled={removeDisabled}>
          {intl.formatMessage(messages.removeIntegrationSubmit)}
        </Button>
        <Button variant="link" onClick={onClose} isDisabled={isDeleting}>
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

SourceRemoveModal.displayName = 'SourceRemoveModal';
