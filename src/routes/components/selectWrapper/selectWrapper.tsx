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
  appendTo?: HTMLElement | (() => HTMLElement) | 'inline' | 'parent';
  ariaLabel?: string;
  className?: string;
  direction?: 'up' | 'down';
  id?: string;
  isDisabled?: boolean;
  maxMenuHeight?: string;
  onSelect?: (event, value: SelectWrapperOption) => void;
  placeholder?: string;
  options?: SelectWrapperOption[];
  position?: 'right' | 'left' | 'center' | 'start' | 'end';
  selection?: string | SelectWrapperOption;
  status?: 'success' | 'warning' | 'danger';
  toggleAriaLabel?: string;
  toggleIcon?: React.ReactNode;
}

type SelectWrapperProps = SelectWrapperOwnProps;

const SelectWrapper: React.FC<SelectWrapperProps> = ({
  appendTo,
  ariaLabel,
  className,
  direction,
  id,
  isDisabled,
  maxMenuHeight,
  onSelect = () => {},
  options,
  placeholder = null,
  position,
  selection,
  status,
  toggleAriaLabel,
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
        key={`${option.value}-${index}`}
        value={option}
      >
        {option.toString()}
      </SelectOption>
    );
  };

  const getPlaceholder = () => {
    const label = typeof selection === 'string' ? selection : selection?.toString();

    // Find label from localized options, if available
    const optionLabel = options?.find(option => option.value === label)?.toString();

    return optionLabel || label || placeholder;
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
      aria-label={toggleAriaLabel}
      icon={toggleIcon && <Icon>{toggleIcon}</Icon>}
      isDisabled={isDisabled}
      isExpanded={isOpen}
      isFullWidth
      onClick={handleOnToggle}
      ref={toggleRef}
      status={status}
    >
      {getPlaceholder()}
    </MenuToggle>
  );

  return (
    <div className={className ? `${className} selectWrapper` : 'selectWrapper'}>
      <Select
        id={id}
        isScrollable={maxMenuHeight !== undefined}
        maxMenuHeight={maxMenuHeight}
        onOpenChange={isExpanded => setIsOpen(isExpanded)}
        onSelect={handleOnSelect}
        ouiaId={id}
        isOpen={isOpen}
        popperProps={{
          appendTo: appendTo as any,
          direction,
          position,
        }}
        selected={selection}
        toggle={toggle}
      >
        <SelectList aria-label={ariaLabel}>
          {options?.map((option, index) => getSelectOption(option, index))}
        </SelectList>
      </Select>
    </div>
  );
};

export default SelectWrapper;
