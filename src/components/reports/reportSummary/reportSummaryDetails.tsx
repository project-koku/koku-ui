import './reportSummaryDetails.scss';

import { Tooltip } from '@patternfly/react-core';
import { Report, ReportType } from 'api/reports/report';
import { ComputedReportItemType } from 'components/charts/common/chartDatumUtils';
import { EmptyValueState } from 'components/state/emptyValueState/emptyValueState';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { DashboardChartType } from 'store/dashboard/common/dashboardCommon';
import { formatCurrency, formatValue, unitsLookupKey, ValueFormatterOptions } from 'utils/valueFormatter';

interface ReportSummaryDetailsOwnProps {
  chartType?: DashboardChartType;
  computedReportItem?: string;
  computedReportItemValue?: string;
  costLabel?: string;
  report: Report;
  requestValueFormatterOptions?: ValueFormatterOptions;
  requestLabel?: string;
  reportType?: ReportType;
  showTooltip?: boolean;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  units?: string;
  usageValueFormatterOptions?: ValueFormatterOptions;
  usageLabel?: string;
  valueFormatterOptions?: ValueFormatterOptions;
}

type ReportSummaryDetailsProps = ReportSummaryDetailsOwnProps & WrappedComponentProps;

const ReportSummaryDetailsBase: React.SFC<ReportSummaryDetailsProps> = ({
  chartType,
  computedReportItem = 'cost',
  computedReportItemValue = 'total',
  costLabel,
  intl,
  report,
  requestValueFormatterOptions,
  requestLabel,
  reportType,
  showTooltip = false,
  showUnits = false,
  showUsageFirst = false,
  units,
  usageValueFormatterOptions,
  usageLabel,
  valueFormatterOptions,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const hasTotal = report && report.meta && report.meta.total;
  const hasCost = hasTotal && report.meta.total.cost && report.meta.total.cost.total;
  const hasCount = hasTotal && report.meta.total.count;
  const hasSupplementaryCost =
    hasTotal &&
    report.meta.total.supplementary &&
    report.meta.total.supplementary.total &&
    report.meta.total.supplementary.total.value;
  const hasInfrastructureCost =
    hasTotal &&
    report.meta.total.infrastructure &&
    report.meta.total.infrastructure[computedReportItemValue] &&
    report.meta.total.infrastructure[computedReportItemValue].value;
  const hasRequest = hasTotal && report.meta.total.request;
  const hasUsage = hasTotal && report.meta.total.usage;

  if (hasTotal) {
    cost = formatCurrency(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD',
      valueFormatterOptions
    );
    supplementaryCost = formatCurrency(
      hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
      hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD',
      valueFormatterOptions
    );
    infrastructureCost = formatCurrency(
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].value : 0,
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].units : 'USD',
      valueFormatterOptions
    );
    request = formatValue(
      hasRequest ? report.meta.total.request.value : 0,
      hasRequest ? report.meta.total.request.units : undefined,
      requestValueFormatterOptions ? usageValueFormatterOptions : valueFormatterOptions
    );

    if (hasUsage && report.meta.total.usage.value >= 0) {
      usage = formatValue(
        hasUsage ? report.meta.total.usage.value : 0,
        hasUsage ? report.meta.total.usage.units : undefined,
        usageValueFormatterOptions ? usageValueFormatterOptions : valueFormatterOptions
      );
    } else {
      // Workaround for https://github.com/project-koku/koku-ui/issues/1058
      usage = formatValue(
        hasUsage ? (report.meta.total.usage as any) : 0,
        hasCount ? report.meta.total.count.units : undefined,
        usageValueFormatterOptions ? usageValueFormatterOptions : valueFormatterOptions
      );
    }
  }

  const getCostLayout = (showAltHeroFont: boolean = false) => {
    let value = cost;
    if (computedReportItem === ComputedReportItemType.infrastructure) {
      value = infrastructureCost;
    } else if (computedReportItem === ComputedReportItemType.supplementary) {
      value = supplementaryCost;
    }

    const altHeroFont = showAltHeroFont ? 'Alt' : '';

    return (
      <div className="valueContainer">
        {showTooltip ? (
          <Tooltip
            content={intl.formatMessage(messages.DashboardTotalCostTooltip, { infrastructureCost, supplementaryCost })}
            enableFlip
          >
            <div className={`value${altHeroFont}`}>{value}</div>
          </Tooltip>
        ) : (
          <div className={`value${altHeroFont}`}>{value}</div>
        )}
        <div className="text">
          <div>{costLabel}</div>
        </div>
      </div>
    );
  };

  const getRequestLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string = hasRequest ? report.meta.total.request.units : undefined;
    const unitsLabel = intl.formatMessage(messages.Units, { units: unitsLookupKey(usageUnits) });

    return (
      <div className="valueContainer">
        <span className="value">{request}</span>
        {Boolean(showUnits && (units || (hasRequest && report.meta.total.request.value >= 0))) && (
          <span className="units">{unitsLabel}</span>
        )}
        <div className="text">
          <div>{requestLabel}</div>
        </div>
      </div>
    );
  };

  const getUsageLayout = () => {
    if (!usageLabel) {
      return null;
    }
    const usageUnits: string = hasUsage ? report.meta.total.usage.units : undefined;
    // added as a work-around for azure #1079
    const _units = unitsLookupKey(units ? units : usageUnits);
    const unitsLabel = intl.formatMessage(messages.Units, { units: _units });

    return (
      <div className="valueContainer">
        <span className="value">{usage}</span>
        {Boolean(showUnits && (units || (hasUsage && report.meta.total.usage.value >= 0))) && (
          <span className="units">{unitsLabel}</span>
        )}
        <div className="text">
          <div>{usageLabel}</div>
        </div>
      </div>
    );
  };

  if (
    chartType === DashboardChartType.dailyCost ||
    chartType === DashboardChartType.dailyTrend ||
    chartType === DashboardChartType.cost
  ) {
    return <>{getCostLayout(reportType === ReportType.cost)}</>;
  } else if (chartType === DashboardChartType.trend) {
    if (showUsageFirst) {
      return (
        <>
          {getUsageLayout()}
          {getCostLayout(reportType === ReportType.cost)}
        </>
      );
    }
    return (
      <>
        {getCostLayout(reportType === ReportType.cost)}
        {getUsageLayout()}
      </>
    );
  } else if (chartType === DashboardChartType.usage) {
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
  } else {
    return null;
  }
};

const ReportSummaryDetails = injectIntl(ReportSummaryDetailsBase);

export { ReportSummaryDetails, ReportSummaryDetailsProps };
