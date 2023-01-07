import type { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { getComputedReportItems } from 'utils/computedReport/getComputedReportItems';

import { styles } from './cluster.styles';
import { ClusterModal } from './clusterModal';

interface ClusterOwnProps {
  groupBy: string;
  report: Report;
  title?: string;
}

interface ClusterState {
  isOpen: boolean;
  showAll: boolean;
}

type ClusterProps = ClusterOwnProps & WrappedComponentProps;

class ClusterBase extends React.Component<ClusterProps> {
  protected defaultState: ClusterState = {
    isOpen: false,
    showAll: false,
  };
  public state: ClusterState = { ...this.defaultState };

  constructor(props: ClusterProps) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  public handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  public render() {
    const { groupBy, intl, report, title } = this.props;
    const { isOpen, showAll } = this.state;

    let charCount = 0;
    const maxChars = 50;
    const someClusters = [];
    const allClusters = [];

    const computedItems = getComputedReportItems({
      report,
      idKey: groupBy as any,
    });

    // Get clusters from all projects -- see https://issues.redhat.com/browse/COST-3371
    const clusters = [];
    computedItems.map(item => {
      if (item.clusters) {
        item.clusters.map(cluster => {
          if (!clusters.includes(cluster)) {
            clusters.push(cluster);
          }
        });
      }
    });
    if (clusters.length === 0) {
      return null;
    }

    // Sort clusters from multiple projects
    clusters.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });

    for (const cluster of clusters) {
      const prefix = someClusters.length > 0 ? ', ' : '';
      const clusterString = `${prefix}${cluster}`;
      if (showAll) {
        someClusters.push(clusterString);
      } else if (charCount <= maxChars) {
        if (charCount + clusterString.length > maxChars) {
          someClusters.push(
            clusterString
              .slice(0, maxChars - charCount)
              .trim()
              .concat('...')
          );
        } else {
          someClusters.push(clusterString);
        }
      }
      charCount += clusterString.length;
      allClusters.push(cluster);
    }

    return (
      <div style={styles.clustersContainer}>
        {Boolean(someClusters) && someClusters.map((cluster, index) => <span key={index}>{cluster}</span>)}
        {Boolean(someClusters.length < allClusters.length) && (
          <a data-testid="cluster-lnk" href="#/" onClick={this.handleOpen}>
            {intl.formatMessage(messages.detailsMoreClusters, { value: allClusters.length - someClusters.length })}
          </a>
        )}
        <ClusterModal clusters={clusters} groupBy={groupBy} isOpen={isOpen} onClose={this.handleClose} title={title} />
      </div>
    );
  }
}

const Cluster = injectIntl(ClusterBase);

export default Cluster;
