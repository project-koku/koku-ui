import React from 'react';
import { TabContent } from './tabContent';
import { TabData } from './tabItem';
import { TabNavigation } from './tabNavigation';

interface TabsProps {
  isShrink?: boolean;
  selected: TabData['id'];
  onChange(tabId: TabData['id']): void;
  tabs: TabData[];
}

const Tabs: React.SFC<TabsProps> = ({ isShrink, selected, tabs, onChange }) => {
  const selectedTab = tabs.find(tab => tab.id === selected);

  return (
    <div>
      <TabNavigation
        isShrink={isShrink}
        tabs={tabs}
        selected={selectedTab}
        onChange={onChange}
      />
      <TabContent data={selectedTab} />
    </div>
  );
};

export { Tabs, TabsProps };
