import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface ClusterViewOwnProps {
  item: ComputedReportItem;
}

type ClusterViewProps = ClusterViewOwnProps & WithTranslation;

class ClusterViewBase extends React.Component<ClusterViewProps> {
  public render() {
    const { item } = this.props;

    if (!item.clusters) {
      return null;
    }
    return item.clusters.map((cluster, index) => <div key={`cluster-${index}`}>{cluster}</div>);
  }
}

const ClusterView = withTranslation()(ClusterViewBase);

export { ClusterView, ClusterViewBase };
