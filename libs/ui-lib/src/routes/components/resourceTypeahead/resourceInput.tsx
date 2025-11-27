import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import {
  Button,
  Divider,
  Menu,
  MenuContent,
  MenuItem,
  MenuList,
  Popper,
  TextInputGroup,
  TextInputGroupMain,
  TextInputGroupUtilities,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import type { FormEvent } from 'react';
import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

interface ResourceInputOwnProps {
  ariaLabel?: string;
  isDisabled?: boolean;
  onChange?: (evt: FormEvent, value: string) => void;
  onClear?: () => void;
  options?: ToolbarLabelGroup[];
  onSelect?: (value: string) => void;
  placeholder?: string;
  search?: string;
}

type ResourceInputProps = ResourceInputOwnProps;

// Functionality is based on this composable typeahead demo https://v4-archive.patternfly.org/v4/demos/composable-menu/#composable-typeahead-select
// Alternatively, this could be implemented using this Search demo https://www.patternfly.org/components/search-input/react-demos/#search-with-autocomplete
const ResourceInput: React.FC<ResourceInputProps> = ({
  ariaLabel,
  isDisabled,
  onChange,
  onClear,
  options,
  onSelect,
  placeholder,
  search,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useMemo(() => React.createRef<HTMLDivElement>(), []);
  const textInputGroupRef = useMemo(() => React.createRef<HTMLDivElement>(), []);
  const intl = useIntl();

  // apply focus to the text input
  const focusTextInput = () => {
    textInputGroupRef.current.querySelector('input').focus();
  };

  const getInputGroup = () => {
    return (
      <div ref={textInputGroupRef}>
        <TextInputGroup isDisabled={isDisabled}>
          <TextInputGroupMain
            aria-label={ariaLabel}
            icon={<SearchIcon />}
            value={search}
            onChange={onChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleOnTextInputKeyDown}
            placeholder={placeholder}
          />
          {search && search.length && (
            <TextInputGroupUtilities>
              <Button
                icon={<TimesIcon />}
                variant="plain"
                onClick={handleOnClear}
                aria-label={intl.formatMessage(messages.typeaheadAriaClear)}
              ></Button>
            </TextInputGroupUtilities>
          )}
        </TextInputGroup>
      </div>
    );
  };

  const getMenu = () => {
    return (
      <div ref={menuRef}>
        <Menu onSelect={handleOnMenuSelect} onKeyDown={handleOnMenuKeyDown}>
          <MenuContent>
            <MenuList>{getMenuItems()}</MenuList>
          </MenuContent>
        </Menu>
      </div>
    );
  };

  const getMenuItems = () => {
    const menuItems = options?.map(option => (
      <MenuItem key={option.key} itemId={option.key}>
        {option.key}
      </MenuItem>
    ));

    // add a heading to the menu
    const headingItem = (
      <MenuItem isDisabled key="heading">
        {menuItems.length ? intl.formatMessage(messages.suggestions) : intl.formatMessage(messages.noResultsFound)}
      </MenuItem>
    );

    if (menuItems.length) {
      menuItems.unshift(<Divider key="divider" />);
    }
    menuItems.unshift(headingItem);

    return menuItems;
  };

  const handleOnClear = () => {
    setIsOpen(false);
    if (onClear) {
      onClear();
    }
  };

  // Enable keyboard only usage while focused on the menu
  const handleOnMenuKeyDown = event => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      focusTextInput();
      setIsOpen(false);
    }
  };

  // Add the text of the selected item
  const handleOnMenuSelect = event => {
    event.stopPropagation();

    const value = event.target.innerText || search;
    if (value.trim() === '') {
      return;
    }
    setIsOpen(false);
    if (onSelect) {
      onSelect(value);
    }
  };

  // Close menu when a click occurs outside the menu or text input group
  const handleOnPopperClick = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      !textInputGroupRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  // Enable keyboard only usage while focused on the text input
  const handleOnTextInputKeyDown = event => {
    switch (event.key) {
      case 'Enter':
        handleOnMenuSelect(event);
        break;
      case 'Escape':
      case 'Tab':
        focusTextInput();
        setIsOpen(false);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Allow focus on the menu and navigate using the arrow keys
        if (menuRef.current) {
          const firstElement = menuRef.current.querySelector('li > button:not(:disabled)');
          (firstElement as any)?.focus();
        }
        break;
      default:
        // Open menu upon any un-designated keys
        setIsOpen(true);
    }
  };

  return (
    <Popper
      trigger={getInputGroup()}
      popper={getMenu()}
      appendTo={() => textInputGroupRef.current}
      isVisible={isOpen}
      onDocumentClick={handleOnPopperClick}
    />
  );
};

export { ResourceInput };
