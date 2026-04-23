import './deprecatePriceList.scss';

import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { usePriceListEnabledToggle } from 'routes/settings/priceList/utils/hooks';

interface DeprecatePriceListOwnProps {
  isOpen?: boolean;
  item: PriceListData;
  onClose?: () => void;
}

type DeprecatePriceListProps = DeprecatePriceListOwnProps;

const DeprecatePriceList: React.FC<DeprecatePriceListProps> = ({ isOpen, item, onClose }) => {
  const intl = useIntl();
  const { togglePriceListEnabled } = usePriceListEnabledToggle(item, onClose);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.deprecatePriceListTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        <p>{intl.formatMessage(messages.deprecatePriceListDesc)}</p>
        <br />
        <List>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem1)}</ListItem>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem2)}</ListItem>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem3)}</ListItem>
        </List>
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" onClick={togglePriceListEnabled}>
          {intl.formatMessage(messages.deprecate)}
        </Button>
        <Button key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeprecatePriceList;
