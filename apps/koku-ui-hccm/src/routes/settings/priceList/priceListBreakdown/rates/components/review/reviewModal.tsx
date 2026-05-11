import {
  Button,
  Checkbox,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

interface ReviewModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  priceList: PriceListData;
}

type ReviewModalProps = ReviewModalOwnProps;

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onConfirm, priceList }) => {
  const intl = useIntl();

  const [isConfirmChecked, setIsConfirmChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsConfirmChecked(false);
    }
  }, [isOpen]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.priceListReview)} />
      <ModalBody>
        <Stack hasGutter>
          <StackItem>
            <Content>{intl.formatMessage(messages.priceListAssignedTo)}</Content>
          </StackItem>
          <StackItem>
            <Content component={ContentVariants.ol}>
              {priceList?.assigned_cost_models?.map((costModel, index) => (
                <Content component={ContentVariants.li} key={`cost-model-${index}`}>
                  {costModel?.name || ''}
                </Content>
              ))}
            </Content>
          </StackItem>
          <StackItem>
            <Content component={ContentVariants.ul}>
              <Content component={ContentVariants.li}>
                {intl.formatMessage(messages.recalculateCurrentMonthDesc)}
              </Content>
              <Content component={ContentVariants.li}>
                {intl.formatMessage(messages.recalculatePreviousMonthDesc)}
              </Content>
            </Content>
          </StackItem>
          <StackItem>
            <Content>{intl.formatMessage(messages.continueConfirm)}</Content>
          </StackItem>
          <StackItem>
            <Checkbox
              id="confirmCheckbox"
              isChecked={isConfirmChecked}
              label={intl.formatMessage(messages.continueConfirmDesc)}
              onChange={(_event, checked) => setIsConfirmChecked(checked)}
            />
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button isAriaDisabled={!isConfirmChecked} onClick={onConfirm} variant="primary">
          {intl.formatMessage(messages.continue)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { ReviewModal };
