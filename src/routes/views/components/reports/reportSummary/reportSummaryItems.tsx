import './reportSummaryItems.scss';

import { Skeleton } from '@patternfly/react-core';
import type { Report, ReportItem } from 'api/reports/report';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { FetchStatus } from 'store/common';
import type { ComputedReportItem, ComputedReportItemsParams } from 'utils/computedReport/getComputedReportItems';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { skeletonWidth } from 'utils/skeleton';

interface ReportSummaryItemsRenderProps {
  items: ComputedReportItem[];
}

interface ReportSummaryItemsOwnProps extends ComputedReportItemsParams<Report, ReportItem> {
  children?(props: ReportSummaryItemsRenderProps): React.ReactNode;
  status?: number;
}

export type ReportSummaryItemsProps = ReportSummaryItemsOwnProps & WrappedComponentProps;

class ReportSummaryItemsBase extends React.Component<ReportSummaryItemsProps> {
  public shouldComponentUpdate(nextProps: ReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { idKey, report } = this.props;

    const computedItems = getComputedReportItems({
      report,
      idKey,
    });

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id === 'Other' || id === 'Others';
      }
    });

    if (otherIndex !== -1) {
      return [...computedItems.slice(0, otherIndex), ...computedItems.slice(otherIndex + 1), computedItems[otherIndex]];
    }

    return computedItems;
  }

  public render() {
    const { children, status } = this.props;

    if (status === FetchStatus.inProgress) {
      return (
        <>
          <Skeleton width={skeletonWidth.md} />
          <Skeleton className="skeleton" width={skeletonWidth.md} />
          <Skeleton className="skeleton" width={skeletonWidth.md} />
          <Skeleton className="skeleton" width={skeletonWidth.md} />
        </>
      );
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const ReportSummaryItems = injectIntl(ReportSummaryItemsBase);

export default ReportSummaryItems;
