import React from 'react';
import {
  ComputedOcpOnAwsReportItem,
  getComputedOcpOnAwsReportItems,
  GetComputedOcpOnAwsReportItemsParams,
} from 'utils/getComputedOcpOnAwsReportItems';

interface OcpOnAwsReportSummaryItemsRenderProps {
  items: ComputedOcpOnAwsReportItem[];
}

interface OcpOnAwsReportSummaryItemsProps
  extends GetComputedOcpOnAwsReportItemsParams {
  children?(props: OcpOnAwsReportSummaryItemsRenderProps): React.ReactNode;
}

class OcpOnAwsReportSummaryItems extends React.Component<
  OcpOnAwsReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: OcpOnAwsReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedOcpOnAwsReportItems({
      report,
      idKey,
      labelKey,
    });

    const otherIndex = computedItems.findIndex(i => {
      const id = i.id;
      if (id && id !== null) {
        return id.toString().includes('Other');
      }
    });

    if (otherIndex !== -1) {
      return [
        ...computedItems.slice(0, otherIndex),
        ...computedItems.slice(otherIndex + 1),
        computedItems[otherIndex],
      ];
    }

    return computedItems;
  }

  public render() {
    const { report, children } = this.props;
    if (!report) {
      return null;
    }

    const items = this.getItems();

    return <ul>{children({ items })}</ul>;
  }
}

export {
  OcpOnAwsReportSummaryItems,
  OcpOnAwsReportSummaryItemsProps,
  OcpOnAwsReportSummaryItemsRenderProps,
};
