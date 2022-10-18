import { Title, TitleSize } from '@patternfly/react-core';
import React from 'react';

interface Props {
  title: string;
  value: string;
}

const Item: React.SFC<Props> = ({ title, value }) => (
  <div style={{ paddingBottom: '12px' }}>
    <Title size={TitleSize.md}>{title}</Title>
    <Title size={TitleSize.lg}>{value}</Title>
  </div>
);

export default Item;
