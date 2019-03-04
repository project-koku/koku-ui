import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './ocpReportSummaryDetails.styles';

interface OcpReportSummaryDetailsProps {
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  label: string;
  report: OcpReport;
  reportType?: OcpReportType;
  requestLabel?: string;
}

const OcpReportSummaryDetails: React.SFC<OcpReportSummaryDetailsProps> = ({
  label,
  formatValue,
  formatOptions,
  report,
  reportType = OcpReportType.cost,
  requestLabel,
}) => {
  let value: string | number = '----';
  let requestValue: string | number = '----';

  if (report && report.total) {
    if (reportType === OcpReportType.cost) {
      const units: string = report.total.cost.units
        ? report.total.cost.units
        : 'USD';
      value = formatValue(
        report.total.cost.value ? report.total.cost.value : 0,
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
        {Boolean(reportType !== OcpReportType.cost) && (
          <div className={css(styles.value, styles.requestedValue)}>
            {requestValue}
            <div className={css(styles.text)}>{requestLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

export { OcpReportSummaryDetails, OcpReportSummaryDetailsProps };
