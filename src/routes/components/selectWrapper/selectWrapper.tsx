import './selectWrapper.scss';

import { Icon, MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React from 'react';

export interface SelectWrapperOption {
  desc?: string; // Description
  toString(): string; // Label
  value?: string;
}

interface SelectWrapperOwnProps {
  id?: string;
  isDisabled?: boolean;
  isOpen?: boolean;
  isOverride?: boolean;
  onToggle?: (isOpen: boolean) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  position?: 'right' | 'left' | 'center' | 'start' | 'end';
  selected?: SelectWrapperOption;
  selectOptions?: SelectWrapperOption[];
  toggleIcon?: React.ReactNode;
}

type SelectWrapperProps = SelectWrapperOwnProps;

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  id,
  isDisabled,
  isOpen,
  isOverride = true,
  onToggle = () => {},
  onSelect = () => {},
  placeholder,
  position,
  selected,
  selectOptions,
  toggleIcon,
}) => {
  const toggle = toggleRef => (
    <MenuToggle
      icon={toggleIcon && <Icon>{toggleIcon}</Icon>}
      isDisabled={isDisabled}
      isExpanded={isOpen}
      onClick={() => onToggle(!isOpen)}
      ref={toggleRef}
    >
      {placeholder && placeholder}
      {selected?.toString()}
    </MenuToggle>
  );
  return (
    <div className={isOverride ? 'selectOverride' : undefined}>
      <Select
        id={id}
        onOpenChange={isExpanded => onToggle(isExpanded)}
        onSelect={(_evt, value) => onSelect(value as string)}
        isOpen={isOpen}
        popperProps={
          position && {
            position,
          }
        }
        selected={selected}
        toggle={toggle}
      >
        <SelectList>
          {selectOptions.map(option => (
            <SelectOption description={option.desc ? option.desc : undefined} key={option.value} value={option.value}>
              {option.toString()}
            </SelectOption>
          ))}
        </SelectList>
      </Select>
    </div>
  );
};

export default SelectWrapper;
