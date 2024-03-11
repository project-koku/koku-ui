import { Accordion, AccordionContent, AccordionItem, AccordionToggle, PageSection } from '@patternfly/react-core';
import { useIsTagMappingToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { styles } from './tagLabels.styles';
import TagMapping from './tagMapping/tagMapping';
import { Tags } from './tags';

// eslint-disable-next-line no-shadow
const enum TagLabelsItem {
  tagMapping = 'tagMapping',
  tags = 'tags',
}

const getIdKeyForItem = (item: TagLabelsItem) => {
  switch (item) {
    case TagLabelsItem.tagMapping:
      return 'tagMapping';
    case TagLabelsItem.tags:
      return 'tags';
  }
};

interface AvailableItem {
  item: TagLabelsItem;
  label: string;
}

interface TagLabelsOwnProps {
  canWrite?: boolean;
}

type TagLabelsProps = TagLabelsOwnProps;

const TagLabels: React.FC<TagLabelsProps> = ({ canWrite }) => {
  const [activeKey, setActiveKey] = useState(0);
  const isTagMappingToggleEnabled = useIsTagMappingToggleEnabled();
  const intl = useIntl();

  const getAvailableItems = () => {
    const availableItems: AvailableItem[] = [
      {
        item: TagLabelsItem.tags,
        label: intl.formatMessage(messages.tagLabelsEnable),
      },
      {
        item: TagLabelsItem.tagMapping,
        label: intl.formatMessage(messages.tagLabelsMap),
      },
    ];
    return availableItems;
  };

  const handleOnClick = (event, index) => {
    if (activeKey !== index) {
      setActiveKey(index);
    }
  };

  const getAccordionContent = (item: TagLabelsItem, index: number) => {
    const emptyTab = <></>; // Lazily load tabs

    if (activeKey !== index) {
      return emptyTab;
    }

    const currentItem = getIdKeyForItem(item);
    if (currentItem === TagLabelsItem.tagMapping) {
      return <TagMapping canWrite={canWrite} />;
    } else if (currentItem === TagLabelsItem.tags) {
      return <Tags canWrite={canWrite} />;
    } else {
      return emptyTab;
    }
  };

  const getAccordionItem = (availableItems: AvailableItem[]) => {
    return availableItems.map((val, index) => {
      return (
        <AccordionItem key={`accordion-${index}`}>
          <AccordionToggle
            id={`accordion-toggle-${index}`}
            isExpanded={activeKey === index}
            onClick={_evt => {
              handleOnClick(_evt, index);
            }}
          >
            {val.label}
          </AccordionToggle>
          <AccordionContent isHidden={activeKey !== index}>{getAccordionContent(val.item, index)}</AccordionContent>
        </AccordionItem>
      );
    });
  };

  const availableItems = getAvailableItems();

  return (
    <PageSection isFilled>
      <div style={styles.container}>
        {isTagMappingToggleEnabled ? (
          <Accordion asDefinitionList>{getAccordionItem(availableItems)}</Accordion>
        ) : (
          <Tags canWrite={canWrite} />
        )}
      </div>
    </PageSection>
  );
};

export default TagLabels;
