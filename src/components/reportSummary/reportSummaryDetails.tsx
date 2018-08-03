import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import React from 'react';
import { styles } from './reportSummaryDetails.styles';

interface ReportSummaryDetailsProps {
  report: Report;
  label: string;
  description: string;
  formatValue?(value: number): string | number;
}

const ReportSummaryDetails: React.SFC<ReportSummaryDetailsProps> = ({
  label,
  description,
  formatValue,
  report,
}) => {
  let value: string | number = '----';
  if (report) {
    const total = report.total ? report.total.value : 0;
    value = formatValue(total);
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
