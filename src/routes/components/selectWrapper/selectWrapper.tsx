import './selectWrapper.scss';

import { Badge, Icon, MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React, { useState } from 'react';

import { styles } from './select.styles';

export interface SelectWrapperOption {
  desc?: string; // Description
  toString(): string; // Label
  value?: string;
}

interface SelectWrapperOwnProps {
  ariaLabel?: string;
  className?: string;
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
  className,
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
    if (isCheckbox) {
      let isSelected = false;
      if (Array.isArray(selections)) {
        const selection = selections.find(val =>
          typeof val === 'string' ? val === option.value : val.value === option.value
        );
        isSelected = selection !== undefined;
      }
      return (
        <SelectOption hasCheckbox key={index} isSelected={isSelected} value={option}>
          {option.toString()}
        </SelectOption>
      );
    }
    return (
      <SelectOption description={option.desc ? option.desc : undefined} key={index} value={option}>
        {option.toString()}
      </SelectOption>
    );
  };

  const getBadge = () => {
    if (isCheckbox && Array.isArray(selections) && selections.length > 0) {
      return (
        <Badge isRead style={styles.badge}>
          {selections.length}
        </Badge>
      );
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
        className={className}
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
