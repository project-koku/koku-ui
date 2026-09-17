import { EmptyState, EmptyStateBody, EmptyStateFooter } from '@patternfly/react-core';
import React from 'react';

interface EmptyStateBaseProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  actions?: React.ReactNode;
}

function EmptyStateBase(props: EmptyStateBaseProps): JSX.Element {
  return (
    <EmptyState headingLevel="h2" icon={props.icon} titleText={props.title} className="pf-m-redhat-font">
      <EmptyStateBody>{props.description}</EmptyStateBody>
      <EmptyStateFooter>{props.actions ? props.actions : null}</EmptyStateFooter>
    </EmptyState>
  );
}

export default EmptyStateBase;
