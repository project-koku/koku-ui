import './selectWrapper.scss';

import {
  Button,
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons/dist/esm/icons/times-icon';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import type { SelectWrapperOption } from './selectWrapper';

interface SelectTypeaheadWrapperOwnProps {
  ariaLabel?: string;
  id?: string;
  isDisabled?: boolean;
  onClear?: () => void;
  onSelect?: (event, value: SelectWrapperOption) => void;
  placeholder?: string;
  selection?: string | SelectWrapperOption;
  selectOptions?: SelectWrapperOption[];
}

type SelectTypeaheadWrapperProps = SelectTypeaheadWrapperOwnProps;

const SelectTypeaheadWrapper: React.FC<SelectTypeaheadWrapperProps> = ({
  ariaLabel,
  id,
  isDisabled,
  onClear = () => {},
  onSelect = () => {},
  placeholder = null,
  selection,
  selectOptions: initialSelectOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectOptions, setSelectOptions] = useState<SelectWrapperOption[]>(initialSelectOptions);
  const [focusedItemIndex, setFocusedItemIndex] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();
  const intl = useIntl();

  const getSelectOption = (option, index) => {
    const isSelected = option.value === (typeof selection === 'string' ? selection : selection?.value);

    return (
      <SelectOption
        description={option.desc}
        key={index}
        id={`select-typeahead-${index}`}
        isDisabled={option.isDisabled}
        isFocused={focusedItemIndex === index}
        isSelected={isSelected}
        onClick={evt => handleOnSelect(evt, option)}
        value={option}
      >
        {option.toString()}
      </SelectOption>
    );
  };

  const handleOnBlur = () => {
    setInputValue(selection?.toString);
  };

  const handleOnClear = () => {
    setInputValue('');
    setFilterValue('');
    textInputRef?.current?.focus();
    onClear();
  };

  const handleOnToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnSelect = (_evt, value) => {
    if (isOpen) {
      setInputValue(value);
      setFilterValue('');
    }
    setIsOpen(false);
    setFocusedItemIndex(null);
    setActiveItem(null);
    onSelect(_evt, value);
  };

  const handleOnTextInputChange = (_evt, value) => {
    setInputValue(value);
    setFilterValue(value);
  };

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === 'ArrowUp') {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = selectOptions.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }
      if (key === 'ArrowDown') {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (focusedItemIndex === null || focusedItemIndex === selectOptions.length - 1) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }
      setFocusedItemIndex(indexToFocus);
      setActiveItem(`select-typeahead-${indexToFocus}`);
    }
  };

  const handleOnInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = selectOptions.filter(option => !option.isDisabled);
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex ? enabledMenuItems[focusedItemIndex] : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case 'Enter':
        if (focusedItem) {
          handleOnSelect(event, focusedItem);
        }
        break;
      case 'Tab':
      case 'Escape':
        setIsOpen(false);
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const toggle = toggleRef => (
    <MenuToggle
      isDisabled={isDisabled}
      isExpanded={isOpen}
      isFullWidth
      onClick={handleOnToggleClick}
      ref={toggleRef}
      variant="typeahead"
    >
      <TextInputGroup isPlain>
        <TextInputGroupMain
          value={inputValue}
          onBlur={handleOnBlur}
          onClick={handleOnToggleClick}
          onChange={handleOnTextInputChange}
          onKeyDown={handleOnInputKeyDown}
          id="typeahead-select-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder={placeholder}
          {...(activeItem && { 'aria-activedescendant': activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-typeahead-listbox"
        />
        <TextInputGroupUtilities>
          {!!inputValue && (
            <Button
              variant="plain"
              onClick={handleOnClear}
              aria-label={intl.formatMessage(messages.selectClearAriaLabel)}
            >
              <TimesIcon aria-hidden />
            </Button>
          )}
        </TextInputGroupUtilities>
      </TextInputGroup>
    </MenuToggle>
  );

  useEffect(() => {
    let newSelectOptions = cloneDeep(initialSelectOptions);

    // Filter menu items based on the text input value when one exists
    if (filterValue) {
      newSelectOptions = initialSelectOptions.filter(option =>
        option.value.toLowerCase().includes(filterValue.toLowerCase())
      );

      // When no options are found after filtering, display 'No results found'
      if (!(newSelectOptions.length && filterValue.trim().length)) {
        newSelectOptions = [{ isDisabled: true, toString: () => intl.formatMessage(messages.noResultsFound) }];
      }

      // Open the menu when the input value changes and the new value is not empty
      if (!isOpen) {
        setIsOpen(true);
      }
    }

    setSelectOptions(newSelectOptions);
    setActiveItem(null);
    setFocusedItemIndex(null);
  }, [filterValue]);

  return (
    <div className="selectOverride">
      <Select
        id={id}
        isOpen={isOpen}
        onSelect={handleOnSelect}
        onOpenChange={() => setIsOpen(false)}
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

export default SelectTypeaheadWrapper;
