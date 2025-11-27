import './dateRange.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
import messages from '@koku-ui/i18n/locales/messages';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

import { DateRangeType, getDateRange } from '../../utils/dateRange';

interface DateRangeOwnProps {
  dateRangeType?: string;
  isCurrentMonthData?: boolean;
  isDataAvailable?: boolean;
  isPreviousMonthData?: boolean;
  isDisabled?: boolean;
  isExplorer?: boolean;
  onSelect(value: string);
}

type DateRangeProps = DateRangeOwnProps;

const DateRange: React.FC<DateRangeProps> = ({
  dateRangeType,
  isCurrentMonthData,
  isDataAvailable,
  isPreviousMonthData,
  isExplorer,
  onSelect,
}) => {
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
        label: messages.explorerDateRange,
        value: DateRangeType.currentMonthToDate,
        isDisabled: isDataAvailable === false || isCurrentMonthData === false,
      },
      {
        label: messages.explorerDateRange,
        value: DateRangeType.previousMonth,
        isDisabled: isDataAvailable === false || isPreviousMonthData === false,
      },
    ];
    if (isExplorer) {
      options.push(
        {
          label: messages.explorerDateRange,
          value: DateRangeType.previousMonthToDate,
          isDisabled: isDataAvailable === false || (isCurrentMonthData === false && isPreviousMonthData === false),
        },
        {
          label: messages.explorerDateRange,
          value: DateRangeType.lastThirtyDays,
          isDisabled: isDataAvailable === false || (isCurrentMonthData === false && isPreviousMonthData === false),
        },
        {
          label: messages.explorerDateRange,
          value: DateRangeType.lastSixtyDays,
          isDisabled: isDataAvailable === false,
        },
        {
          label: messages.explorerDateRange,
          value: DateRangeType.lastNinetyDays,
          isDisabled: isDataAvailable === false,
        },
        { label: messages.explorerDateRange, value: DateRangeType.custom, isDisabled: isDataAvailable === false }
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
