import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, TitleSizes } from '@patternfly/react-core';
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
      <EmptyStateIcon icon={props.icon} />
      <Title headingLevel="h2" size={TitleSizes.lg}>
        {props.title}
      </Title>
      <EmptyStateBody>{props.description}</EmptyStateBody>
      {props.actions ? props.actions : null}
    </EmptyState>
  );
}

export default EmptyStateBase;
