import { css } from '@patternfly/react-styles';
import { AwsReport } from 'api/awsReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './awsReportSummaryDetails.styles';

interface AwsReportSummaryDetailsProps {
  report: AwsReport;
  label: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
}

const AwsReportSummaryDetails: React.SFC<AwsReportSummaryDetailsProps> = ({
  label,
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
      </div>
    </div>
  );
};

export { AwsReportSummaryDetails, AwsReportSummaryDetailsProps };
