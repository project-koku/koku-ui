import { Title } from '@patternfly/react-core';
import React from 'react';

interface Props {
  title: string;
  value: string;
}

const Item: React.SFC<Props> = ({ title, value }) => (
  <div style={{ paddingBottom: '12px' }}>
    <Title headingLevel="h2" size="md">
      {title}
    </Title>
    <Title headingLevel="h2" size="lg">
      {value}
    </Title>
  </div>
);

export default Item;
