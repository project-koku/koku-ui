import React from 'react';
import { TabContent } from './tabContent';
import { TabData } from './tabItem';
import { TabNavigation } from './tabNavigation';

interface TabsProps {
  selected: TabData['id'];
  onChange(tabId: TabData['id']): void;
  tabs: TabData[];
}

const Tabs: React.SFC<TabsProps> = ({ selected, tabs, onChange }) => {
  const selectedTab = tabs.find(tab => tab.id === selected);

  return (
    <div>
      <TabNavigation tabs={tabs} selected={selectedTab} onChange={onChange} />
      <TabContent data={selectedTab} />
    </div>
  );
};

export { Tabs, TabsProps };
