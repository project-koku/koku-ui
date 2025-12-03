import './reportSummaryDetails.scss';

import type { Report } from '@koku-ui/api/reports/report';
import { ReportType } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Tooltip } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { DashboardChartType } from '../../../../store/dashboard/common/dashboardCommon';
import type { FormatOptions } from '../../../../utils/format';
import { formatCurrency, formatUnits, unitsLookupKey } from '../../../../utils/format';
import { ComputedReportItemType } from '../../charts/common/chartDatum';
import { EmptyValueState } from '../../state/emptyValueState';

interface ReportSummaryDetailsOwnProps {
  chartType?: DashboardChartType;
  computedReportItem?: string;
  computedReportItemValue?: string;
  costLabel?: string;
  formatOptions?: FormatOptions;
  report: Report;
  requestFormatOptions?: FormatOptions;
  requestLabel?: string;
  reportType?: ReportType;
  showTooltip?: boolean;
  showUnits?: boolean;
  showUsageFirst?: boolean;
  units?: string;
  usageFormatOptions?: FormatOptions;
  usageLabel?: string;
}

export type ReportSummaryDetailsProps = ReportSummaryDetailsOwnProps & WrappedComponentProps;

const ReportSummaryDetailsBase: React.FC<ReportSummaryDetailsProps> = ({
  chartType,
  computedReportItem = 'cost',
  computedReportItemValue = 'total',
  costLabel,
  formatOptions,
  intl,
  report,
  requestFormatOptions,
  requestLabel,
  reportType,
  showTooltip = false,
  showUnits = false,
  showUsageFirst = false,
  units,
  usageFormatOptions,
  usageLabel,
}) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;
  let request: string | React.ReactNode = <EmptyValueState />;
  let usage: string | React.ReactNode = <EmptyValueState />;

  const hasTotal = report?.meta?.total;
  const hasCost = report?.meta?.total?.cost?.total;
  const hasCount = report?.meta?.total?.count;
  const hasSupplementaryCost = report?.meta?.total?.supplementary?.total?.value;
  const hasInfrastructureCost =
    report?.meta?.total?.infrastructure &&
    report.meta.total.infrastructure[computedReportItemValue] &&
    report.meta.total.infrastructure[computedReportItemValue].value;
  const hasRequest = report?.meta?.total?.request;
  const hasUsage = report?.meta?.total?.usage;

  if (hasTotal) {
    cost = formatCurrency(
      hasCost ? report.meta.total.cost.total.value : 0,
      hasCost ? report.meta.total.cost.total.units : 'USD',
      formatOptions
    );
    supplementaryCost = formatCurrency(
      hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
      hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD',
      formatOptions
    );
    infrastructureCost = formatCurrency(
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].value : 0,
      hasInfrastructureCost ? report.meta.total.infrastructure[computedReportItemValue].units : 'USD',
      formatOptions
    );
    request = formatUnits(
      hasRequest ? report.meta.total.request.value : 0,
      hasRequest ? report.meta.total.request.units : undefined,
      requestFormatOptions
    );

    if (hasUsage && report.meta.total.usage.value >= 0) {
      usage = formatUnits(
        hasUsage ? report.meta.total.usage.value : 0,
        hasUsage ? report.meta.total.usage.units : undefined,
        usageFormatOptions
      );
    } else {
      // Workaround for https://github.com/project-koku/koku-ui/issues/1058
      usage = formatUnits(
        hasUsage ? (report.meta.total.usage as any) : 0,
        hasCount ? report.meta.total.count.units : undefined,
        usageFormatOptions
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
            content={intl.formatMessage(messages.dashboardTotalCostTooltip, { infrastructureCost, supplementaryCost })}
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
    const unitsLabel = intl.formatMessage(messages.units, { units: unitsLookupKey(usageUnits) });

    return (
      <div className="valueContainer">
        <span className="value">{request}</span>
        {showUnits && (units || (hasRequest && report.meta.total.request.value >= 0)) && (
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
    const unitsLabel = intl.formatMessage(messages.units, { units: _units });

    return (
      <div className="valueContainer">
        <span className="value">{usage}</span>
        {showUnits && (units || (hasUsage && report.meta.total.usage.value >= 0)) && (
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

export default ReportSummaryDetails;
