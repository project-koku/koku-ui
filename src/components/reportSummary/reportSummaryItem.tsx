import { css } from '@patternfly/react-styles';
import React from 'react';
import { ProgressBar } from '../progressBar';
import { styles } from './reportSummaryItem.styles';

interface ReportSummaryItemProps {
  label: React.ReactText;
  value: number;
  totalValue: number;
  formatValue?(value: number): React.ReactText;
}

const ReportSummaryItem: React.SFC<ReportSummaryItemProps> = ({
  label,
  value,
  totalValue,
  formatValue,
}) => {
  const percent = (value / totalValue) * 100;
  return (
    <li className={css(styles.reportSummaryItem)}>
      <div className={css(styles.info)}>
        <div>{label}</div>
        <div>
          {formatValue(value)} ({percent.toFixed(2)}%)
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
