import './dateRange.scss';

import type { MessageDescriptor } from '@formatjs/intl';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

export const enum DateRangeType {
  custom = 'custom', // Custom data retention period in months
  sixMonths = 'six_months', // last 6 months
  threeMonths = 'three_months', // Last 3 months
  twelveMonths = 'twelve_months', // Last 12 months
}

interface DateRangeOwnProps {
  dateRangeType?: string;
  isDisabled?: boolean;
  onSelect: (value: string) => void;
}

type DateRangeProps = DateRangeOwnProps;

const DateRange: React.FC<DateRangeProps> = ({ dateRangeType, isDisabled, onSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const intl = useIntl();

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const getOptions = () => {
    const options: {
      isDisabled?: boolean;
      label: MessageDescriptor;
      value: DateRangeType;
    }[] = [
      {
        label: messages.dateRange,
        value: DateRangeType.twelveMonths,
      },
      {
        label: messages.dateRange,
        value: DateRangeType.sixMonths,
      },
      {
        label: messages.dateRange,
        value: DateRangeType.threeMonths,
      },
      { label: messages.dateRange, value: DateRangeType.custom },
    ];
    return options;
  };

  const handleOnSelect = (_evt: any, value: string) => {
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
          <MenuToggle isDisabled={isDisabled} isExpanded={isOpen} isFullWidth onClick={onToggleClick} ref={toggleRef}>
            {intl.formatMessage(messages.dateRange, { value: dateRangeType })}
          </MenuToggle>
        )}
      >
        <DropdownList>
          {getOptions().map((option, index) => {
            return (
              <DropdownItem value={option.value} isAriaDisabled={option.isDisabled} key={index}>
                {intl.formatMessage(option.label, { value: option.value })}
              </DropdownItem>
            );
          })}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

export { DateRange };
