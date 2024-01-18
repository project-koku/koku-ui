import './selectWrapper.scss';

import { Badge, MenuToggle, Select, SelectList, SelectOption } from '@patternfly/react-core';
import React, { useState } from 'react';

import { styles } from './select.styles';
import type { SelectWrapperOption } from './selectWrapper';

interface SelectCheckboxWrapperOwnProps {
  ariaLabel?: string;
  className?: string;
  id?: string;
  isDisabled?: boolean;
  onSelect?: (event, value: SelectWrapperOption) => void;
  placeholder?: string;
  selections?: string | SelectWrapperOption | (string | SelectWrapperOption)[];
  selectOptions?: SelectWrapperOption[];
}

type SelectCheckboxWrapperProps = SelectCheckboxWrapperOwnProps;

const SelectCheckboxWrapper: React.FC<SelectCheckboxWrapperProps> = ({
  ariaLabel,
  className,
  id,
  isDisabled,
  onSelect = () => {},
  placeholder = null,
  selections,
  selectOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSelectOption = (option, index) => {
    let isSelected = false;
    if (Array.isArray(selections)) {
      const selection = selections.find(val =>
        typeof val === 'string' ? val === option.value : val.value === option.value
      );
      isSelected = selection !== undefined;
    }
    return (
      <SelectOption hasCheckbox key={index} isDisabled={option.isDisabled} isSelected={isSelected} value={option}>
        {option.toString()}
      </SelectOption>
    );
  };

  const getBadge = () => {
    if (Array.isArray(selections) && selections.length > 0) {
      return (
        <Badge isRead style={styles.badge}>
          {selections.length}
        </Badge>
      );
    }
    return null;
  };

  const handleOnSelect = (evt, value) => {
    onSelect(evt, value);
    setIsOpen(false);
  };

  const handleOnToggle = () => {
    setIsOpen(!isOpen);
  };

  const toggle = toggleRef => (
    <MenuToggle isDisabled={isDisabled} isExpanded={isOpen} onClick={handleOnToggle} ref={toggleRef}>
      {placeholder}
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
        selected={selections}
        toggle={toggle}
      >
        <SelectList aria-label={ariaLabel}>
          {selectOptions.map((option, index) => getSelectOption(option, index))}
        </SelectList>
      </Select>
    </div>
  );
};

export default SelectCheckboxWrapper;
