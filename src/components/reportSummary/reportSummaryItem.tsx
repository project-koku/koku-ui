import { Progress, ProgressSize } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './reportSummaryItem.styles';

interface ReportSummaryItemProps {
  label: string;
  units: string;
  value: number;
  totalValue: number;
  formatValue: ValueFormatter;
  formatOptions?: FormatOptions;
}

const ReportSummaryItem: React.SFC<ReportSummaryItemProps> = ({
  label,
  value,
  totalValue,
  formatValue,
  units,
  formatOptions,
}) => {
  const percent = !totalValue ? 0 : (value / totalValue) * 100;
  const percentVal = Number(percent.toFixed(2));
  const percentLabel = `${formatValue(
    value,
    units,
    formatOptions
  )} (${percentVal}%)`;

  return (
    <li className={css(styles.reportSummaryItem)}>
      <Progress
        label={percentLabel}
        value={percentVal}
        title={label}
        size={ProgressSize.sm}
      />
    </li>
  );
};

ReportSummaryItem.defaultProps = {
  formatValue: v => v,
};

export { ReportSummaryItem, ReportSummaryItemProps };
