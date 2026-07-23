import './dateRange.scss';

import type { MessageDescriptor } from '@formatjs/intl';
import type { MenuToggleElement } from '@patternfly/react-core';
import { Dropdown, DropdownItem, DropdownList, MenuToggle } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { DateRangeType, getDateRange } from 'routes/utils/dateRange';

interface DateRangeOwnProps {
  dataRetentionMonths?: number;
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
  dataRetentionMonths,
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
      options.push({
        label: messages.explorerDateRange,
        value: DateRangeType.lastTwoMonths,
        isDisabled: isDataAvailable === false,
      });
      if (dataRetentionMonths > 3) {
        options.push({
          label: messages.explorerDateRange,
          value: DateRangeType.lastThreeMonths,
          isDisabled: isDataAvailable === false,
        });
      }
      if (dataRetentionMonths > 6) {
        options.push({
          label: messages.explorerDateRange,
          value: DateRangeType.lastSixMonths,
          isDisabled: isDataAvailable === false,
        });
      }
      if (dataRetentionMonths > 12) {
        options.push({
          label: messages.explorerDateRange,
          value: DateRangeType.lastTwelveMonths,
          isDisabled: isDataAvailable === false,
        });
      }
      if (dataRetentionMonths) {
        options.push({
          label: messages.explorerDateRange,
          value: DateRangeType.maximum,
          isDisabled: isDataAvailable === false,
        });
      }
      options.push({
        label: messages.explorerDateRange,
        value: DateRangeType.custom,
        isDisabled: isDataAvailable === false,
      });
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
            {intl.formatMessage(messages.explorerDateRange, {
              value: dateRangeType,
              months: dataRetentionMonths ?? '',
            })}
          </MenuToggle>
        )}
      >
        <DropdownList>
          {getOptions().map((option, index) => {
            const { start_date, end_date } = getDateRange(option.value, dataRetentionMonths, false);
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
                {intl.formatMessage(option.label, {
                  value: option.value,
                  months: dataRetentionMonths ?? '',
                })}
              </DropdownItem>
            );
          })}
        </DropdownList>
      </Dropdown>
    </div>
  );
};

export { DateRange };
