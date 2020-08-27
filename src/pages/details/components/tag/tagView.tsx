import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
} from '@patternfly/react-core';
import { Report } from 'api/reports/report';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { styles } from './tag.styles';

interface TagViewOwnProps {
  filterBy: string | number;
  groupBy: string;
  report?: Report;
}

type TagViewProps = TagViewOwnProps & InjectedTranslateProps;

class TagViewBase extends React.Component<TagViewProps> {
  private getDataListItems = () => {
    const { report } = this.props;
    const result = [];

    if (report) {
      for (const tag of report.data) {
        for (const val of tag.values) {
          const id = `${(tag as any).key}:${val}`;
          result.push(
            <DataListItem aria-labelledby={id} key={`${id}-item`}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key={`${id}-cell1`}>
                      <span id={id}>{(tag as any).key}</span>
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
    const { filterBy, groupBy, t } = this.props;
    const dataListItems = this.getDataListItems();

    return (
      <>
        <div>
          <span style={styles.dataListHeading}>
            {t(`group_by.values.${groupBy}`)}
          </span>
        </div>
        <div style={styles.groupByHeading}>
          <span>{filterBy}</span>
        </div>
        <DataList aria-label="Simple data list example" isCompact>
          <DataListItem aria-labelledby="heading1">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary content">
                    <span id="heading1" style={styles.dataListHeading}>
                      {t('tag.heading_key')}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {t('tag.heading_value')}
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

const TagView = translate()(connect()(TagViewBase));

export { TagView, TagViewProps };
