import React from 'react';
import { TabData } from './tabItem';

export interface TabContentProps {
  data: TabData;
}

export const TabContent: React.SFC<TabContentProps> = ({ data }) => {
  const content =
    typeof data.content === 'function' ? data.content(data) : data.content;

  return <div role="tabpanel">{content}</div>;
};
