import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { Report, ReportType } from 'api/reports';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { unitLookupKey } from 'utils/formatValue';
import { styles } from './reportSummaryDetails.styles';

interface ReportSummaryDetailsProps extends InjectedTranslateProps {
  costLabel?: string;
  formatValue?: ValueFormatter;
  formatOptions?: FormatOptions;
  report: Report;
  reportType?: ReportType;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

const ReportSummaryDetailsBase: React.SFC<ReportSummaryDetailsProps> = ({
  costLabel,
  formatValue,
  formatOptions,
  report,
  reportType = ReportType.cost,
  requestFormatOptions,
  requestLabel,
  showUnits = false,
  showUsageFirst = false,
  t,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let markupCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const cloudReportType =
    reportType === ReportType.database ||
    reportType === ReportType.instanceType ||
    reportType === ReportType.network ||
    reportType === ReportType.storage;

  if (report && report.meta && report.meta.total) {
    cost = formatValue(
      report.meta.total.cost ? report.meta.total.cost.value : 0,
      report.meta.total.cost ? report.meta.total.cost.units : 'USD',
      formatOptions
    );
    infrastructureCost = formatValue(
      report.meta.total.infrastructure_cost
        ? report.meta.total.infrastructure_cost.value
        : 0,
      report.meta.total.infrastructure_cost
        ? report.meta.total.infrastructure_cost.units
        : 'USD',
      formatOptions
    );
    markupCost = formatValue(
      report.meta.total.markup_cost ? report.meta.total.markup_cost.value : 0,
      report.meta.total.markup_cost
        ? report.meta.total.markup_cost.units
        : 'USD',
      formatOptions
    );
    if (cloudReportType) {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
    } else {
      usage = formatValue(
        report.meta.total.usage ? report.meta.total.usage.value : 0,
        report.meta.total.usage ? report.meta.total.usage.units : '',
        usageFormatOptions ? usageFormatOptions : formatOptions
      );
      request = formatValue(
        report.meta.total.request ? report.meta.total.request.value : 0,
        report.meta.total.request ? report.meta.total.request.units : '',
        requestFormatOptions ? usageFormatOptions : formatOptions
      );
    }
  }

  const getCostLayout = () => (
    <div className={css(styles.valueContainer)}>
      <Tooltip
        content={t('ocp_cloud_dashboard.total_cost_tooltip', {
          infrastructureCost,
          markupCost,
        })}
        enableFlip
      >
        <div className={css(styles.value)}>{cost}</div>
      </Tooltip>
      <div className={css(styles.text)}>
        <div>{costLabel}</div>
      </div>
    </div>
  );

  const getRequestLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string =
      report && report.meta && report.meta.total && report.meta.total.request
        ? report.meta.total.request.units
        : '';
    const _units = unitLookupKey(usageUnits);
    const unitsLabel = t(`units.${_units}`);

    return (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.value)}>
          {request}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.request &&
              report.meta.total.request.value >= 0
          ) && <span className={css(styles.text)}>{unitsLabel}</span>}
        </div>
        <div className={css(styles.text)}>
          <div>{requestLabel}</div>
        </div>
      </div>
    );
  };

  const getUsageLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string =
      report && report.meta && report.meta.total && report.meta.total.usage
        ? report.meta.total.usage.units
        : '';
    const _units = unitLookupKey(usageUnits);
    const unitsLabel = t(`units.${_units}`);

    return (
      <div className={css(styles.valueContainer)}>
        <div className={css(styles.value)}>
          {usage}
          {Boolean(
            showUnits &&
              report &&
              report.meta &&
              report.meta.total.usage &&
              report.meta.total.usage.value >= 0
          ) && <span className={css(styles.text)}>{unitsLabel}</span>}
        </div>
        <div className={css(styles.text)}>
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (reportType === ReportType.cost) {
    return <>{getCostLayout()}</>;
  } else if (cloudReportType) {
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
  } else {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getRequestLayout()}
        </>
      );
    }
    return (
      <>
        {getRequestLayout()}
        {getUsageLayout()}
      </>
    );
  }
};

const ReportSummaryDetails = translate()(ReportSummaryDetailsBase);

export { ReportSummaryDetails, ReportSummaryDetailsProps };
