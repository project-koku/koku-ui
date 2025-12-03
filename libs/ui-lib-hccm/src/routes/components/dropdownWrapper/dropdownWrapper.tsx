import './dropdownWrapper.scss';

import messages from '@koku-ui/i18n/locales/messages';
import { Dropdown, DropdownItem, DropdownList, MenuToggle, Tooltip } from '@patternfly/react-core';
import { EllipsisVIcon } from '@patternfly/react-icons/dist/esm/icons/ellipsis-v-icon';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

export interface DropdownWrapperItem {
  description?: string; // Item description
  isDisabled?: boolean;
  onClick: (event: any) => void;
  toString?: () => string; // Item label
  tooltipProps?: any;
}

interface DropdownWrapperOwnProps {
  ariaLabel?: string;
  id?: string;
  isDisabled?: boolean;
  isKebab?: boolean;
  items?: DropdownWrapperItem[];
  placeholder?: string;
  position?: 'right' | 'left' | 'center' | 'start' | 'end';
}

type DropdownWrapperProps = DropdownWrapperOwnProps;

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  ariaLabel,
  id,
  isDisabled,
  isKebab,
  items,
  placeholder = null,
  position,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);

  const getDropdownItem = (item, index) => {
    return (
      <DropdownItem
        description={item.description}
        isAriaDisabled={item.isDisabled}
        key={`${item.value}-${index}`}
        onClick={item.onClick ? evt => item.onClick(evt) : undefined}
        tooltipProps={item.tooltipProps}
        value={index}
      >
        {item.toString()}
      </DropdownItem>
    );
  };

  const handleOnSelect = () => {
    setIsOpen(false);
  };

  const handleOnToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggle = toggleRef => {
    const msg = intl.formatMessage(messages.moreOptions);
    return (
      <Tooltip content={msg}>
        <MenuToggle
          aria-label={msg}
          isDisabled={isDisabled}
          isExpanded={isOpen}
          onClick={handleOnToggle}
          ref={toggleRef}
          variant={isKebab ? 'plain' : undefined}
        >
          {isKebab ? <EllipsisVIcon /> : placeholder}
        </MenuToggle>
      </Tooltip>
    );
  };

  return (
    <Dropdown
      id={id}
      isOpen={isOpen}
      onOpenChange={isExpanded => setIsOpen(isExpanded)}
      onSelect={handleOnSelect}
      popperProps={
        position && {
          position,
        }
      }
      toggle={toggle}
    >
      <DropdownList aria-label={ariaLabel}>{items.map((item, index) => getDropdownItem(item, index))}</DropdownList>
    </Dropdown>
  );
};

export default DropdownWrapper;
