import { DataList, DataListCell, DataListItem, DataListItemCells, DataListItemRow } from '@patternfly/react-core';
import { Tag } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';

import { styles } from './tag.styles';

interface TagViewOwnProps {
  groupBy: string;
  groupByValue: string | number;
  tagReport?: Tag;
}

type TagViewProps = TagViewOwnProps & WrappedComponentProps;

class TagViewBase extends React.Component<TagViewProps> {
  private getDataListItems = () => {
    const { tagReport } = this.props;
    const result = [];

    if (tagReport) {
      for (const item of tagReport.data) {
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
    const { groupBy, groupByValue, intl } = this.props;
    const dataListItems = this.getDataListItems();

    return (
      <>
        <div>
          <span style={styles.dataListHeading}>
            {intl.formatMessage(messages.GroupByValues, { value: groupBy, count: 1 })}
          </span>
        </div>
        <div style={styles.groupByHeading}>
          <span>{groupByValue}</span>
        </div>
        <DataList aria-label="Simple data list example" isCompact>
          <DataListItem aria-labelledby="heading1">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary content">
                    <span id="heading1" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.TagHeadingKey)}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.TagHeadingValue)}
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

const TagView = injectIntl(connect()(TagViewBase));

export { TagView, TagViewProps };
