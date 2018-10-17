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

  // Todo: Will need to add this when PF4 progress bar supports custom labels
  // See https://github.com/patternfly/patternfly-react/issues/784
  //
  // {formatValue(value, units, formatOptions)} ({percent.toFixed(2)}%)

  return (
    <li className={css(styles.reportSummaryItem)}>
      <Progress
        value={Number(percent.toFixed(2))}
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
