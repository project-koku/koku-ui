import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './ocpReportSummaryDetails.styles';

interface OcpReportSummaryDetailsProps extends InjectedTranslateProps {
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: OcpReport;
  reportType?: OcpReportType;
  requestLabel?: string;
  usageLabel?: string;
}

const OcpReportSummaryDetailsBase: React.SFC<OcpReportSummaryDetailsProps> = ({
  formatValue,
  formatOptions,
  report,
  reportType = OcpReportType.cost,
  requestLabel,
  usageLabel,
}) => {
  let cost: string | number = '----';
  let requestValue: string | number = '----';

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    if (reportType !== OcpReportType.cost) {
      requestValue = formatValue(
        report.meta.total.request ? report.meta.total.request.value : 0,
        report.meta.total.request ? report.meta.total.request.units : '',
        formatOptions
      );
    }
  }
  return (
    <>
      <div className={css(styles.titleContainer)}>
        <div className={css(styles.value, styles.usageValue)}>
          {cost}
          <div className={css(styles.text)}>
            <div>{usageLabel}</div>
          </div>
        </div>
      </div>
      <div className={css(styles.titleContainer)}>
        {Boolean(reportType !== OcpReportType.cost) && (
          <div className={css(styles.value)}>
            {requestValue}
            <div className={css(styles.text)}>{requestLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

const OcpReportSummaryDetails = translate()(OcpReportSummaryDetailsBase);

export { OcpReportSummaryDetails, OcpReportSummaryDetailsProps };
