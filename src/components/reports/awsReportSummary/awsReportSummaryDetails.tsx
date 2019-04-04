import { css } from '@patternfly/react-styles';
import { AwsReport, AwsReportType } from 'api/awsReports';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './awsReportSummaryDetails.styles';

interface AwsReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  report: AwsReport;
  reportType: AwsReportType;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  showUnits?: boolean;
  unitsLabel?: string;
  usageLabel?: string;
}

const AwsReportSummaryDetailsBase: React.SFC<AwsReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = AwsReportType.cost,
  showUnits = false,
  usageLabel,
  t,
}) => {
  let cost: string | number = '----';
  let usage: string | number = '----';

  const hasTotal = report && report.meta && report.meta.total;
  const costUnits: string =
    hasTotal && report.meta.total.cost ? report.meta.total.cost.units : 'USD';
  const usageUnits: string =
    hasTotal && report.meta.total.usage ? report.meta.total.usage.units : 'USD';

  if (hasTotal) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      costUnits,
      formatOptions
    );
    usage = formatValue(
      report.meta.total.usage ? report.meta.total.usage.value : 0,
      usageUnits,
      formatOptions
    );
  }

  const units = unitLookupKey(usageUnits);
  const unitsLabel = t(`units.${units}`);

  if (reportType === AwsReportType.cost) {
    return (
      <div className={css(styles.reportSummaryDetails)}>
        <div className={css(styles.value)}>{cost}</div>
      </div>
    );
  } else {
    return (
      <>
        <div className={css(styles.valueContainer)}>
          <div className={css(styles.value)}>{cost}</div>
          <div className={css(styles.text)}>
            <div>{costLabel}</div>
          </div>
        </div>
        {Boolean(usageLabel) && (
          <div className={css(styles.valueContainer)}>
            <div className={css(styles.value)}>
              {usage}
              {Boolean(showUnits) && (
                <span className={css(styles.text)}>{unitsLabel}</span>
              )}
            </div>
            <div className={css(styles.text)}>
              <div>{usageLabel}</div>
            </div>
          </div>
        )}
      </>
    );
  }
};

const AwsReportSummaryDetails = translate()(AwsReportSummaryDetailsBase);

export { AwsReportSummaryDetails, AwsReportSummaryDetailsProps };
