import React from 'react';
import { Page } from '../page';

const VerticalNav: React.SFC = () => (
  <Page.Consumer>{() => <nav />}</Page.Consumer>
);

export { VerticalNav };
