import React from 'react';
import { styled } from '../../styles/styled';

const Root = styled('div', {
  boxSizing: 'border-box'
});

const NotFound: React.SFC = () => <Root>Not Found!</Root>;

export default NotFound;
