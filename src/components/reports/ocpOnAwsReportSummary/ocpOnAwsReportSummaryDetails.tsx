import { css } from '@patternfly/react-styles';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './ocpOnAwsReportSummaryDetails.styles';

interface OcpOnAwsReportSummaryDetailsProps {
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  label: string;
  report: OcpOnAwsReport;
  reportType?: OcpOnAwsReportType;
  requestLabel?: string;
}

const OcpOnAwsReportSummaryDetails: React.SFC<
  OcpOnAwsReportSummaryDetailsProps
> = ({
  label,
  formatValue,
  formatOptions,
  report,
  reportType = OcpOnAwsReportType.cost,
  requestLabel,
}) => {
  let value: string | number = '----';
  let requestValue: string | number = '----';

  const awsReportType =
    reportType === OcpOnAwsReportType.instanceType ||
    reportType === OcpOnAwsReportType.storage;

  if (report && report.total) {
    if (reportType === OcpOnAwsReportType.cost) {
      const units: string = report.total.cost.units
        ? report.total.cost.units
        : 'USD';
      value = formatValue(
        report.total.cost.value ? report.total.cost.value : 0,
        units,
        formatOptions
      );
    } else if (awsReportType) {
      const units: string = report.total.usage
        ? report.total.usage.units
        : 'USD';
      value = formatValue(
        report.total.usage.value ? report.total.usage.value : 0,
        units,
        formatOptions
      );
    } else {
      const units: string = report.total.usage.units
        ? report.total.usage.units
        : 'GB';
      value = formatValue(
        report.total.usage.value ? report.total.usage.value : 0,
        units,
        formatOptions
      );
      requestValue = formatValue(
        report.total.request.value ? report.total.request.value : 0,
        units,
        formatOptions
      );
    }
  }
  return (
    <>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.value)}>
          {value}
          <div className={css(styles.text)}>
            <div>{label}</div>
          </div>
        </div>
      </div>
      <div className={css(styles.titleContainer)}>
        {Boolean(reportType !== OcpOnAwsReportType.cost && !awsReportType) && (
          <div className={css(styles.value, styles.requestedValue)}>
            {requestValue}
            <div className={css(styles.text)}>{requestLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

export { OcpOnAwsReportSummaryDetails, OcpOnAwsReportSummaryDetailsProps };
