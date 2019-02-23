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
  reportType = OcpReportType.charge,
  requestLabel,
}) => {
  let value: string | number = '----';
  let requestValue: string | number = '----';

  if (report && report.total) {
    if (reportType === OcpReportType.charge) {
      const units: string = report.total.units ? report.total.units : 'USD';
      value = formatValue(
        report.total.charge ? report.total.charge : 0,
        units,
        formatOptions
      );
    } else {
      const units: string = report.total.units ? report.total.units : 'GB';
      value = formatValue(
        report.total.usage ? report.total.usage : 0,
        units,
        formatOptions
      );
      requestValue = formatValue(
        report.total.request ? report.total.request : 0,
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
        {Boolean(reportType !== OcpReportType.charge) && (
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
