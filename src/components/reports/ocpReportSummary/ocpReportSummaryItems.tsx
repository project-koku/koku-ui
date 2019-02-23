import React from 'react';
import {
  ComputedOcpReportItem,
  getComputedOcpReportItems,
  GetComputedOcpReportItemsParams,
} from 'utils/getComputedOcpReportItems';

interface OcpReportSummaryItemsRenderProps {
  items: ComputedOcpReportItem[];
}

interface OcpReportSummaryItemsProps extends GetComputedOcpReportItemsParams {
  children?(props: OcpReportSummaryItemsRenderProps): React.ReactNode;
}

class OcpReportSummaryItems extends React.Component<
  OcpReportSummaryItemsProps
> {
  public shouldComponentUpdate(nextProps: OcpReportSummaryItemsProps) {
    return nextProps.report !== this.props.report;
  }

  private getItems() {
    const { report, idKey, labelKey } = this.props;

    const computedItems = getComputedOcpReportItems({
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
  OcpReportSummaryItems,
  OcpReportSummaryItemsProps,
  OcpReportSummaryItemsRenderProps,
};
