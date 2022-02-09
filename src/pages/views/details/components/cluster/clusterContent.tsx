import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface ClusterContentOwnProps {
  item: ComputedReportItem;
}

type ClusterContentProps = ClusterContentOwnProps & WrappedComponentProps;

class ClusterContentBase extends React.Component<ClusterContentProps> {
  public render() {
    const { item } = this.props;

    if (!item.clusters) {
      return null;
    }
    return item.clusters.map((cluster, index) => <div key={`cluster-${index}`}>{cluster}</div>);
  }
}

const ClusterContent = injectIntl(ClusterContentBase);

export { ClusterContent, ClusterContentBase };
