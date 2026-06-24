import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

interface ReviewChangeModalOwnProps {
  costModel: CostModel;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

type ReviewChangeModalProps = ReviewChangeModalOwnProps;

const ReviewChangeModal: React.FC<ReviewChangeModalProps> = ({ costModel, isOpen, onClose, onConfirm }) => {
  const intl = useIntl();

  // Skip dialog if cost models does not have sources
  const shouldSkip = !costModel?.sources?.length;

  const latestOnConfirm = useRef(onConfirm);

  useLayoutEffect(() => {
    latestOnConfirm.current = onConfirm;
  }, [onConfirm]);

  useEffect(() => {
    if (isOpen && shouldSkip) {
      latestOnConfirm.current?.();
    }
  }, [isOpen, shouldSkip]);

  if (shouldSkip) {
    return null;
  }

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader title={intl.formatMessage(messages.priceListReview)} />
      <ModalBody>
        {intl.formatMessage(messages.priceListReviewChange, { costModel: <b>{costModel?.name ?? ''}</b> })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onConfirm} variant="primary">
          {intl.formatMessage(messages.continue)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ReviewChangeModal };
