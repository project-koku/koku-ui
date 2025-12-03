import messages from '@koku-ui/i18n/locales/messages';
import { DataList, DataListCell, DataListItem, DataListItemCells, DataListItemRow } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { formatUnits, unitsLookupKey } from '../../../../../../utils/format';
import type { StorageData } from '../storageLink';
import { styles } from './storageContent.styles';

interface StorageContentOwnProps {
  storageData?: StorageData[];
  virtualMachine?: string;
}

type StorageContentProps = StorageContentOwnProps & WrappedComponentProps;

class StorageContentBase extends React.Component<StorageContentProps, any> {
  private getDataListItems = () => {
    const { intl, storageData } = this.props;
    const result = [];

    if (storageData) {
      Object.keys(storageData).map((key, i) => {
        const data = storageData[key];
        const id = `data-list-${i}`;
        const units = data.usage_units ? unitsLookupKey(data.usage_units) : null;

        result.push(
          <DataListItem aria-labelledby={id} key={`${id}-item`}>
            <DataListItemRow>
              <DataListItemCells
                dataListCells={[
                  <DataListCell key={`${id}-cell1`}>
                    <span id={id}>{data.pvc_name}</span>
                  </DataListCell>,
                  <DataListCell key={`${id}-cell2`}>{data.storage_class}</DataListCell>,
                  <DataListCell key={`${id}-cell2`}>
                    {intl.formatMessage(messages.valueUnits, {
                      value: formatUnits(data.usage, units),
                      units: intl.formatMessage(messages.units, { units }),
                    })}
                  </DataListCell>,
                  <DataListCell key={`${id}-cell2`}>
                    {intl.formatMessage(messages.valueUnits, {
                      value: formatUnits(data.capacity, units),
                      units: intl.formatMessage(messages.units, { units }),
                    })}
                  </DataListCell>,
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
