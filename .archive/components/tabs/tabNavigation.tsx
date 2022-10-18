import { css } from '@patternfly/react-styles';
import React from 'react';
import { TabData, TabItem } from './tabItem';
import { styles } from './tabNavigation.styles';

interface TabNavigationProps {
  isShrink?: boolean;
  tabs: TabData[];
  selected: TabData;
  onChange(tabId: TabData['id']): void;
}

class TabNavigation extends React.Component<TabNavigationProps> {
  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) {
      return;
    }
    const { selected, tabs, onChange } = this.props;

    const modifier = event.key === 'ArrowRight' ? 1 : -1;
    const selectedIndex = tabs.findIndex(t => t.id === selected.id);
    const newIndex = selectedIndex + modifier;
    if (newIndex < 0 || newIndex > tabs.length - 1) {
      return;
    }
    onChange(tabs[newIndex].id);
  };

  public render() {
    const { isShrink, tabs, selected, onChange } = this.props;

    return (
      <div
        role="tablist"
        style={styles.tabNavigation}
        onKeyDown={this.handleKeyDown}
      >
        {tabs.map(tab => (
          <TabItem
            isShrink={isShrink}
            onSelect={onChange}
            key={tab.id}
            data={tab}
            isSelected={tab.id === selected.id}
          />
        ))}
      </div>
    );
  }
}

export { TabNavigation, TabNavigationProps };
