import { css } from '@patternfly/react-styles';
import React from 'react';
import { styles } from './tabItem.styles';

interface TabData {
  id: string | number;
  label: string;
  content: React.ReactNode | ((data: TabData) => React.ReactNode);
}

interface TabItemProps {
  data: TabData;
  isSelected: boolean;
  isShrink?: boolean;
  onSelect(tabId: TabData['id']): void;
}

class TabItem extends React.Component<TabItemProps> {
  private handleClick = () => {
    const { onSelect, data } = this.props;
    onSelect(data.id);
  };

  public render() {
    const { data, isSelected, isShrink } = this.props;

    return (
      <div
        role="tab"
        onClick={this.handleClick}
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        className={css(
          styles.tabItem,
          isSelected && styles.selected,
          isShrink && styles.tabItemShrink
        )}
      >
        {data.label}
      </div>
    );
  }
}

export { TabItem, TabData, TabItemProps };
