import { EmptyState, EmptyStateBody, EmptyStateFooter, EmptyStateHeader, EmptyStateIcon } from '@patternfly/react-core';
import React from 'react';

interface EmptyStateBaseProps {
  title: string;
  description: string;
  icon: React.ComponentType;
  actions?: React.ReactNode;
}

function EmptyStateBase(props: EmptyStateBaseProps): JSX.Element {
  return (
    <EmptyState className="pf-m-redhat-font">
      <EmptyStateHeader titleText={<>{props.title}</>} icon={<EmptyStateIcon icon={props.icon} />} headingLevel="h2" />
      <EmptyStateBody>{props.description}</EmptyStateBody>
      <EmptyStateFooter>{props.actions ? props.actions : null}</EmptyStateFooter>
    </EmptyState>
  );
}

export default EmptyStateBase;
