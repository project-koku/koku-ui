import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './reportSummaryDetails.styles';

interface ReportSummaryDetailsProps {
  report: Report;
  label: string;
  description: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
}

const ReportSummaryDetails: React.SFC<ReportSummaryDetailsProps> = ({
  label,
  description,
  formatValue,
  formatOptions,
  report,
}) => {
  let value: string | number = '----';
  if (report) {
    value = report.total
      ? formatValue(report.total.value, report.total.units, formatOptions)
      : 0;
  }

  return (
    <div className={css(styles.reportSummaryDetails)}>
      <div className={css(styles.value)}>{value}</div>
      <div className={css(styles.text)}>
        <div>{label}</div>
        <div>{description}</div>
      </div>
    </div>
  );
};

export { ReportSummaryDetails, ReportSummaryDetailsProps };
