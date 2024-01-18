import './selectWrapper.scss';

import { Icon, MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React, { useState } from 'react';

export interface SelectWrapperOption {
  description?: string; // Option description
  compareTo?: (option: SelectWrapperOption) => boolean;
  isDisabled?: boolean;
  toString?: () => string; // Option label
  value?: string; // Option value
}

interface SelectWrapperOwnProps {
  ariaLabel?: string;
  id?: string;
  isDisabled?: boolean;
  onSelect?: (event, value: SelectWrapperOption) => void;
  placeholder?: string;
  position?: 'right' | 'left' | 'center' | 'start' | 'end';
  selection?: string | SelectWrapperOption;
  selectOptions?: SelectWrapperOption[];
  toggleIcon?: React.ReactNode;
}

type SelectWrapperProps = SelectWrapperOwnProps;

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  ariaLabel,
  id,
  isDisabled,
  onSelect = () => {},
  placeholder = null,
  position,
  selection,
  selectOptions,
  toggleIcon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSelectOption = (option, index) => {
    const isSelected = option.value === (typeof selection === 'string' ? selection : selection?.value);

    return (
      <SelectOption
        description={option.description}
        isDisabled={option.isDisabled}
        isSelected={isSelected}
        key={index}
        value={option}
      >
        {option?.toString()}
      </SelectOption>
    );
  };

  const getPlaceholder = () => {
    const label = typeof selection === 'string' ? selection : selection?.toString();
    return label ? label : placeholder;
  };

  const handleOnSelect = (evt, value) => {
    onSelect(evt, value);
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
    </MenuToggle>
  );

  return (
    <div className="selectWrapper">
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
        selected={selection}
        toggle={toggle}
      >
        <SelectList aria-label={ariaLabel}>
          {selectOptions.map((option, index) => getSelectOption(option, index))}
        </SelectList>
      </Select>
    </div>
  );
};

export default SelectWrapper;
