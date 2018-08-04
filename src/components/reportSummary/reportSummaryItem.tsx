import { css } from '@patternfly/react-styles';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { ProgressBar } from '../progressBar';
import { styles } from './reportSummaryItem.styles';

interface ReportSummaryItemProps {
  label: React.ReactText;
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
  const percent = (value / totalValue) * 100;
  return (
    <li className={css(styles.reportSummaryItem)}>
      <div className={css(styles.info)}>
        <div>{label}</div>
        <div>
          {formatValue(value, units, formatOptions)} ({percent.toFixed(2)}%)
        </div>
      </div>
      <ProgressBar progress={percent} />
    </li>
  );
};

ReportSummaryItem.defaultProps = {
  formatValue: v => v,
};

export { ReportSummaryItem, ReportSummaryItemProps };
