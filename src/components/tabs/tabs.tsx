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
  if (tabs.length === 0) {
    return <div>No data was found</div>;
  }

  const selectedTab = tabs.find(tab => tab.id === selected);

  return (
    <div>
      <TabNavigation
        isShrink={isShrink}
        tabs={tabs}
        selected={selectedTab || tabs[0]}
        onChange={onChange}
      />
      <TabContent data={selectedTab || tabs[0]} />
    </div>
  );
};

export { Tabs, TabsProps };
