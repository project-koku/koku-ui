import { css } from '@patternfly/react-styles';
import { AzureReport, AzureReportType } from 'api/reports/azureReports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './azureReportSummaryDetails.styles';

interface AzureReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  report: AzureReport;
  reportType: AzureReportType;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  units?: string;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const AzureReportSummaryDetailsBase: React.SFC<AzureReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = AzureReportType.cost,
  showUnits = false,
  showUsageFirst = false,
  t,
  units,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    if (report.meta.total.usage && report.meta.total.usage.value) {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    } else {
      // Workaround for https://github.com/project-koku/koku-ui/issues/1058
      usage = formatValue(
        report.meta.total.usage ? (report.meta.total.usage as any) : 0,
        report.meta.total.count ? report.meta.total.count.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    }
  }

  const getCostLayout = () => (
    <div style={styles.valueContainer}>
      <div style={styles.value}>{cost}</div>
      <div style={styles.text}>
        <div>{costLabel}</div>
      </div>
    </div>
  );

  const getUsageLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string =
      report && report.meta && report.meta.total && report.meta.total.usage
        ? report.meta.total.usage.units
        : '';
    // added as a work-around for azure #1079
    const _units = unitLookupKey(units ? units : usageUnits);
    const unitsLabel = t(`units.${_units}`);

    return (
      <div style={styles.valueContainer}>
        <div style={styles.value}>
          {usage}
          {Boolean(
            showUnits &&
              (units ||
                (report &&
                  report.meta &&
                  report.meta.total.usage &&
                  report.meta.total.usage.value >= 0))
          ) && <span style={styles.text}>{unitsLabel}</span>}
        </div>
        <div style={styles.text}>
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (reportType === AzureReportType.cost) {
    return <>{getCostLayout()}</>;
  } else {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getCostLayout()}
        </>
      );
    }
    return (
      <>
        {getCostLayout()}
        {getUsageLayout()}
      </>
    );
  }
};

const AzureReportSummaryDetails = translate()(AzureReportSummaryDetailsBase);

export { AzureReportSummaryDetails, AzureReportSummaryDetailsProps };
