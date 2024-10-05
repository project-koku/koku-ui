import './dateRange.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { getSinceDateRangeString } from 'utils/dates';

interface DateRangeOwnProps {
  dateRangeType?: string;
  isCurrentMonthData: boolean;
  isDisabled?: boolean;
  isExplorer?: boolean;
  onSelect(value: string);
}

type DateRangeProps = DateRangeOwnProps;

const DateRange: React.FC<DateRangeProps> = ({ dateRangeType, isCurrentMonthData, isExplorer, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const intl = useIntl();

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const getOptions = () => {
    const options: {
      isDisabled?: boolean;
      label: MessageDescriptor;
      value: string;
    }[] = [
      { label: messages.explorerDateRange, value: 'current_month_to_date', isDisabled: isCurrentMonthData === false },
      { label: messages.explorerDateRange, value: 'previous_month' },
    ];
    if (isExplorer) {
      options.push(
        { label: messages.explorerDateRange, value: 'previous_month_to_date' },
        { label: messages.explorerDateRange, value: 'last_thirty_days' },
        { label: messages.explorerDateRange, value: 'last_sixty_days' },
        { label: messages.explorerDateRange, value: 'last_ninety_days' },
        { label: messages.explorerDateRange, value: 'custom' }
      );
    }
    return options;
  };

  const handleOnSelect = (_evt, value) => {
    if (onSelect) {
      onSelect(value);
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdownOverride">
      <Dropdown
        isOpen={isOpen}
        onSelect={handleOnSelect}
        onOpenChange={(val: boolean) => setIsOpen(val)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle ref={toggleRef} onClick={onToggleClick} isExpanded={isOpen} isFullWidth>
            {intl.formatMessage(messages.explorerDateRange, { value: dateRangeType })}
          </MenuToggle>
        )}
      >
        <DropdownList>
          {getOptions().map((option, index) => (
            <DropdownItem
              value={option.value}
              isAriaDisabled={option.isDisabled}
              key={index}
              tooltipProps={
                option.isDisabled
                  ? {
                      content: intl.formatMessage(messages.noDataForDate, {
                        dateRange: getSinceDateRangeString(undefined, option.value === 'previous_month' ? 1 : 0, true),
                      }),
                      position: 'right',
                    }
                  : undefined
              }
            >
              {intl.formatMessage(option.label, { value: option.value })}
            </DropdownItem>
          ))}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

export { DateRange };
