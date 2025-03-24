import { DataList, DataListCell, DataListItem, DataListItemCells, DataListItemRow } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { StorageData } from 'routes/details/ocpBreakdown/virtualization/storage/storageLink';

import { styles } from './storageContent.styles';

interface StorageContentOwnProps {
  storageData?: StorageData[];
  virtualMachine?: string;
}

type StorageContentProps = StorageContentOwnProps & WrappedComponentProps;

class StorageContentBase extends React.Component<StorageContentProps, any> {
  private getDataListItems = () => {
    const { storageData } = this.props;
    const result = [];

    if (storageData) {
      Object.keys(storageData).map((key, i) => {
        const data = storageData[key];
        const id = `data-list-${i}`;
        result.push(
          <DataListItem aria-labelledby={id} key={`${id}-item`}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={`${id}-cell1`}>
                    <span id={id}>{data.pvc_name}</span>
                  </DataListCell>,
                  <DataListCell key={`${id}-cell2`}>{data.storage_class}</DataListCell>,
                  <DataListCell key={`${id}-cell2`}>{data.usage}</DataListCell>,
                  <DataListCell key={`${id}-cell2`}>{data.capacity}</DataListCell>,
                ]}
              />
            </DataListItemRow>
          </DataListItem>
        );
      });
    }
    return result;
  };

  public render() {
    const { virtualMachine, intl } = this.props;
    const dataListItems = this.getDataListItems();

    return (
      <>
        <div style={styles.dataListHeading}>{intl.formatMessage(messages.virtualMachine)}</div>
        <div style={styles.dataListSubHeading}>{virtualMachine}</div>
        <DataList aria-label={intl.formatMessage(messages.storage)} isCompact>
          <DataListItem aria-labelledby="heading1">
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key="primary content">
                    <span id="heading1" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.storageNames)}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.storageClass)}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.usage)}
                    </span>
                  </DataListCell>,
                  <DataListCell key="secondary content">
                    <span id="heading2" style={styles.dataListHeading}>
                      {intl.formatMessage(messages.capacity)}
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

const StorageContent = injectIntl(connect()(StorageContentBase));

export { StorageContent };
