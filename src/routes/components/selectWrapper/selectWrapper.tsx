import './selectWrapper.scss';

import { Badge, Icon, MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React, { useState } from 'react';

export interface SelectWrapperOption {
  desc?: string; // Description
  toString(): string; // Label
  value?: string;
}

interface SelectWrapperOwnProps {
  ariaLabel?: string;
  id?: string;
  isCheckbox?: boolean;
  isDisabled?: boolean;
  onSelect?: (event, value: string) => void;
  placeholder?: string;
  position?: 'right' | 'left' | 'center' | 'start' | 'end';
  selections?: string | SelectWrapperOption | (string | SelectWrapperOption)[];
  selectOptions?: SelectWrapperOption[];
  toggleIcon?: React.ReactNode;
}

type SelectWrapperProps = SelectWrapperOwnProps;

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  ariaLabel,
  id,
  isCheckbox,
  isDisabled,
  onSelect = () => {},
  placeholder = null,
  position,
  selections,
  selectOptions,
  toggleIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSelectOption = (option, index) => {
    if (isCheckbox && Array.isArray(selections)) {
      const isSelected = selections.find(val => val === option.value);
      return (
        <SelectOption hasCheckbox key={index} isSelected={isSelected !== undefined} value={option.value}>
          {option.toString()}
        </SelectOption>
      );
    }
    return (
      <SelectOption description={option.desc ? option.desc : undefined} key={index} value={option.value}>
        {option.toString()}
      </SelectOption>
    );
  };

  const getBadge = () => {
    if (isCheckbox && Array.isArray(selections) && selections.length > 0) {
      return <Badge isRead>{selections.length}</Badge>;
    }
    return null;
  };

  const getPlaceholder = () => {
    if (isCheckbox) {
      return placeholder;
    }
    return selections ? selections?.toString() : placeholder;
  };

  const handleOnSelect = (evt, value) => {
    if (onSelect) {
      onSelect(evt, value);
    }
    setIsOpen(false);
  };

  const handleOnToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggle = toggleRef => (
    <MenuToggle
      icon={toggleIcon && <Icon>{toggleIcon}</Icon>}
      isDisabled={isDisabled}
      isExpanded={isOpen}
      onClick={handleOnToggle}
      ref={toggleRef}
    >
      {getPlaceholder()}
      {getBadge()}
    </MenuToggle>
  );

  return (
    <div className="selectOverride">
      <Select
        id={id}
        onOpenChange={isExpanded => setIsOpen(isExpanded)}
        onSelect={handleOnSelect}
        isOpen={isOpen}
        popperProps={
          position && {
            position,
          }
        }
        selected={selections}
        toggle={toggle}
      >
        <SelectList aria-label={ariaLabel ? ariaLabel : undefined}>
          {selectOptions.map((option, index) => getSelectOption(option, index))}
        </SelectList>
      </Select>
    </div>
  );
};

export default SelectWrapper;
