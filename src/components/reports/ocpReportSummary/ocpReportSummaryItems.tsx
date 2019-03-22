import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import {
  ComputedOcpReportItem,
  getComputedOcpReportItems,
  GetComputedOcpReportItemsParams,
} from 'utils/getComputedOcpReportItems';

interface OcpReportSummaryItemsRenderProps {
  items: ComputedOcpReportItem[];
}

interface OcpReportSummaryItemsOwnProps
  extends GetComputedOcpReportItemsParams {
  children?(props: OcpReportSummaryItemsRenderProps): React.ReactNode;
}

type OcpReportSummaryItemsProps = OcpReportSummaryItemsOwnProps &
  InjectedTranslateProps;

class OcpReportSummaryItemsBase extends React.Component<
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
    const { report, children, t } = this.props;

    if (!report) {
      return `${t('loading')}...`;
    } else {
      const items = this.getItems();
      return <ul>{children({ items })}</ul>;
    }
  }
}

const OcpReportSummaryItems = translate()(OcpReportSummaryItemsBase);

export {
  OcpReportSummaryItems,
  OcpReportSummaryItemsProps,
  OcpReportSummaryItemsRenderProps,
};
