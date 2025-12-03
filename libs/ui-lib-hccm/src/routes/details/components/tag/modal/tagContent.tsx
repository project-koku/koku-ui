import type { Tag } from '@koku-ui/api/tags/tag';
import type { TagData } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import { DataList, DataListCell, DataListItem, DataListItemCells, DataListItemRow } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { styles } from './tagContent.styles';

interface TagContentOwnProps {
  groupBy: string;
  groupByValue: string | number;
  tagData?: TagData[];
  tagReport?: Tag;
  virtualMachine?: string;
}

type TagContentProps = TagContentOwnProps & WrappedComponentProps;

class TagContentBase extends React.Component<TagContentProps, any> {
  private getDataListItems = () => {
    const { tagData, tagReport } = this.props;
    const result = [];

    if (tagData || tagReport) {
      const tags = tagData || tagReport.data;
      for (const item of tags) {
        for (const val of item.values) {
          const id = `${(item as any).key}:${val}`;
          result.push(
            <DataListItem aria-labelledby={id} key={`${id}-item`}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key={`${id}-cell1`}>
                      <span id={id}>{(item as any).key}</span>
                    </DataListCell>,
                    <DataListCell key={`${id}-cell2`}>{val}</DataListCell>,
                  ]}
                />
              </DataListItemRow>
            </DataListItem>
          );
        }
      }
    }
    return result;
  };

  public render() {
    const { groupBy, groupByValue, intl, virtualMachine } = this.props;
    const dataListItems = this.getDataListItems();

    return (
      <>
        <div style={styles.dataListHeading}>
          {intl.formatMessage(virtualMachine ? messages.virtualMachine : messages.groupByValuesTitleCase, {
            value: groupBy,
            count: 1,
          })}
        </div>
        <div style={styles.dataListSubHeading}>{virtualMachine ? virtualMachine : groupByValue}</div>
        <DataList aria-label={intl.formatMessage(messages.tagNames)} isCompact>
          <DataListItem aria-labelledby="heading1">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary content">
                    <span id="heading1" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.tagHeadingKey)}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.tagHeadingValue)}
                    </span>
                  </DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
          {dataListItems.map(item => item)}
        </DataList>
      </>
    );
  }
}

const TagContent = injectIntl(connect()(TagContentBase));

export { TagContent };
export type { TagContentProps };
