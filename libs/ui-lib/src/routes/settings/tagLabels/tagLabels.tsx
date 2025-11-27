import messages from '@koku-ui/i18n/locales/messages';
import { Card, CardBody, CardTitle, Tab, TabContent, Tabs, TabTitleText } from '@patternfly/react-core';
import React, { type RefObject, useState } from 'react';
import { useIntl } from 'react-intl';

import TagMapping from './tagMapping/tagMapping';
import { Tags } from './tags';

const enum TagLabelsTab {
  tagMapping = 'tagMapping',
  tags = 'tags',
}

export const getIdKeyForTab = (tab: TagLabelsTab) => {
  switch (tab) {
    case TagLabelsTab.tagMapping:
      return 'tagMapping';
    case TagLabelsTab.tags:
      return 'tags';
  }
};

interface AvailableTab {
  contentRef: RefObject<any>;
  tab: TagLabelsTab;
}

interface TagLabelsOwnProps {
  canWrite?: boolean;
}

type TagLabelsProps = TagLabelsOwnProps;

const TagLabels: React.FC<TagLabelsProps> = ({ canWrite }) => {
  const [activeTabKey, setActiveTabKey] = useState(0);
  const intl = useIntl();

  const getAvailableTabs = () => {
    const availableTabs: AvailableTab[] = [
      {
        contentRef: React.createRef(),
        tab: TagLabelsTab.tags,
      },
      {
        contentRef: React.createRef(),
        tab: TagLabelsTab.tagMapping,
      },
    ];
    return availableTabs;
  };

  const getTab = (tab: TagLabelsTab, contentRef, index: number) => {
    return (
      <Tab
        eventKey={index}
        key={`${getIdKeyForTab(tab)}-tab`}
        tabContentId={`tab-${index}`}
        tabContentRef={contentRef}
        title={<TabTitleText>{getTabTitle(tab)}</TabTitleText>}
      />
    );
  };

  const getTabContent = (availableTabs: AvailableTab[]) => {
    return availableTabs.map((val, index) => {
      return (
        <TabContent
          eventKey={index}
          key={`${getIdKeyForTab(val.tab)}-tabContent`}
          id={`tab-${index}`}
          ref={val.contentRef as any}
        >
          {getTabItem(val.tab, index)}
        </TabContent>
      );
    });
  };

  const getTabItem = (tab: TagLabelsTab, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeTabKey !== index) {
      return emptyTab;
    }

    const currentTab = getIdKeyForTab(tab);
    if (currentTab === TagLabelsTab.tagMapping) {
      return <TagMapping canWrite={canWrite} />;
    } else if (currentTab === TagLabelsTab.tags) {
      return <Tags canWrite={canWrite} />;
    } else {
      return emptyTab;
    }
  };

  const getTabs = (availableTabs: AvailableTab[]) => {
    return (
      <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
        {availableTabs.map((val, index) => getTab(val.tab, val.contentRef, index))}
      </Tabs>
    );
  };

  const getTabTitle = (tab: TagLabelsTab) => {
    if (tab === TagLabelsTab.tagMapping) {
      return intl.formatMessage(messages.tagLabelsMap);
    } else if (tab === TagLabelsTab.tags) {
      return intl.formatMessage(messages.tagLabelsEnable);
    }
  };

  const handleTabClick = (event, tabIndex) => {
    if (activeTabKey !== tabIndex) {
      setActiveTabKey(tabIndex);
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <Card>
      <CardTitle>{getTabs(availableTabs)}</CardTitle>
      <CardBody>{getTabContent(availableTabs)}</CardBody>
    </Card>
  );
};

export default TagLabels;
