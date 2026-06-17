import './dateRange.scss';

import type { MessageDescriptor } from '@formatjs/intl';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { DateRangeType, getDateRange } from 'routes/utils/dateRange';

interface DateRangeOwnProps {
  dateRangeType?: string;
  isDisabled?: boolean;
  onSelect(value: string);
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
        value: DateRangeType.lastTwelveMonths,
      },
      {
        label: messages.dateRange,
        value: DateRangeType.lastSixMonths,
      },
      {
        label: messages.dateRange,
        value: DateRangeType.lastThreeMonths,
      },
      { label: messages.dateRange, value: DateRangeType.custom },
    ];
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
          <MenuToggle isDisabled={isDisabled} isExpanded={isOpen} isFullWidth onClick={onToggleClick} ref={toggleRef}>
            {intl.formatMessage(messages.explorerDateRange, { value: dateRangeType })}
          </MenuToggle>
        )}
      >
        <DropdownList>
          {getOptions().map((option, index) => {
            const { start_date, end_date } = getDateRange(option.value, false);
            const dateRange = intl.formatDateTimeRange(start_date, end_date, {
              day: 'numeric',
              month: 'long',
            });
            return (
              <DropdownItem
                value={option.value}
                isAriaDisabled={option.isDisabled}
                key={index}
                tooltipProps={
                  option.isDisabled
                    ? {
                        content: intl.formatMessage(messages.noDataForDate, { dateRange }),
                        position: 'right',
                      }
                    : undefined
                }
              >
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
