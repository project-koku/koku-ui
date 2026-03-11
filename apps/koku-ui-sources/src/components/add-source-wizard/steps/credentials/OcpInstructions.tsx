import { Content, ContentVariants } from '@patternfly/react-core';
import React from 'react';

const OcpInstructions: React.FC = () => {
  return (
    <div>
      <Content component={ContentVariants.p}>
        For Red Hat OpenShift Container Platform 4.6 and later, install the{' '}
        <strong>costmanagement-metrics-operator</strong> from the OpenShift Container Platform web console.
      </Content>
      <Content component={ContentVariants.p} style={{ marginTop: '8px' }}>
        If you configured the operator to create a source (<code>create_source: true</code>), <strong>STOP</strong> here
        here and <strong>CANCEL</strong> out of this flow.
      </Content>
      <Content component={ContentVariants.p} style={{ marginTop: '8px' }}>
        Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster&apos;s Help
        &gt; About screen.
      </Content>
    </div>
  );
};

export { OcpInstructions };
