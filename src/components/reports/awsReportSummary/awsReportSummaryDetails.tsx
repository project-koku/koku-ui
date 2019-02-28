import { css } from '@patternfly/react-styles';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './awsReportSummaryDetails.styles';

interface AwsReportSummaryDetailsProps {
  report: AwsReport;
  reportType: AwsReportType;
  label: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
}

const AwsReportSummaryDetails: React.SFC<AwsReportSummaryDetailsProps> = ({
  label,
  formatValue,
  formatOptions,
  report,
  reportType = AwsReportType.cost,
}) => {
  let value: string | number = '----';
  if (report && report.total) {
    if (reportType === AwsReportType.cost) {
      const units: string = report.total.cost ? report.total.cost.units : 'USD';
      value = formatValue(
        report.total.cost.value ? report.total.cost.value : 0,
        units,
        formatOptions
      );
    } else {
      const units: string = report.total.usage
        ? report.total.usage.units
        : 'USD';
      value = formatValue(
        report.total.usage.value ? report.total.usage.value : 0,
        units,
        formatOptions
      );
    }
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
