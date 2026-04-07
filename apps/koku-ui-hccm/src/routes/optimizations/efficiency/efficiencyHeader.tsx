import { Flex, FlexItem } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import type { ResourcePathsType } from 'api/resources/resource';
import React, { useEffect, useState } from 'react';
import { Currency } from 'routes/components/currency';
import { DateRange } from 'routes/components/dateRange';
import { GroupBy } from 'routes/components/groupBy';
import type { ComputedOcpReportItemsParams } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { DateRangeType, getCurrentDateRangeType } from 'routes/utils/dateRange';
import type { Filter } from 'routes/utils/filter';

import { styles } from './efficiencyHeader.styles';
import { EfficiencyToolbar } from './efficiencyToolbar';

interface EfficiencyHeaderOwnProps {
  currency?: string;
  groupBy?: string;
  isCurrentMonthData?: boolean;
  isDisabled?: boolean;
  isPreviousMonthData?: boolean;
  onCurrencySelect(value: string);
  onDateRangeSelect(value: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onGroupBySelect(value: string);
  query?: OcpQuery;
  resourcePathsType?: ResourcePathsType;
  timeScopeValue?: number;
}

type EfficiencyHeaderProps = EfficiencyHeaderOwnProps;

const groupByOptions: {
  label: string;
  value: ComputedOcpReportItemsParams['idKey'];
}[] = [
  { label: 'cluster', value: 'cluster' },
  { label: 'project', value: 'project' },
];

// currentDateRangeType?: string;
const EfficiencyHeader: React.FC<EfficiencyHeaderProps> = ({
  currency,
  groupBy,
  isCurrentMonthData,
  isDisabled,
  isPreviousMonthData,
  onCurrencySelect,
  onDateRangeSelect,
  onFilterAdded,
  onFilterRemoved,
  onGroupBySelect,
  query,
  resourcePathsType,
  timeScopeValue,
}: EfficiencyHeaderProps) => {
  const [currentDateRangeType, setCurrentDateRangeType] = useState<string>(DateRangeType.currentMonthToDate);

  useEffect(() => {
    setCurrentDateRangeType(getCurrentDateRangeType(timeScopeValue));
  }, [timeScopeValue]);

  const handleOnDateRangeSelect = (value: string) => {
    setCurrentDateRangeType(value);
    if (onDateRangeSelect) {
      onDateRangeSelect(value);
    }
  };

  const getToolbar = () => {
    return (
      <EfficiencyToolbar
        groupBy={groupBy}
        isDisabled={isDisabled}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        query={query}
        resourcePathsType={resourcePathsType}
      />
    );
  };

  return (
    <>
      <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={styles.perspectiveContainer}>
        <FlexItem>
          <Flex>
            <FlexItem>
              <GroupBy
                getIdKeyForGroupBy={getIdKeyForGroupBy}
                groupBy={groupBy}
                isDisabled={isDisabled}
                onSelect={onGroupBySelect}
                options={groupByOptions}
                timeScopeValue={timeScopeValue}
              />
            </FlexItem>
            <FlexItem>
              <DateRange
                dateRangeType={currentDateRangeType}
                isCurrentMonthData={isCurrentMonthData}
                isDisabled={isDisabled}
                isPreviousMonthData={isPreviousMonthData}
                onSelect={handleOnDateRangeSelect}
              />
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem style={styles.currencyContainer}>
          <Currency currency={currency} onSelect={onCurrencySelect} />
        </FlexItem>
      </Flex>
      <div style={styles.toolbarContainer}>{getToolbar()}</div>
    </>
  );
};

export { EfficiencyHeader };
