import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

interface ClusterContentOwnProps {
  clusters: string[];
}

type ClusterContentProps = ClusterContentOwnProps & WrappedComponentProps;

class ClusterContentBase extends React.Component<ClusterContentProps, any> {
  public render() {
    const { clusters = [] } = this.props;

    if (clusters.length === 0) {
      return null;
    }
    return clusters.map((cluster, index) => <div key={`cluster-${index}`}>{cluster}</div>);
  }
}

const ClusterContent = injectIntl(ClusterContentBase);

export { ClusterContent, ClusterContentBase };
