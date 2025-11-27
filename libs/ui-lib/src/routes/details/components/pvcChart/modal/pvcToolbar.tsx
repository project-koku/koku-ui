import type { Query } from '@koku-ui/api/queries/query';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { BasicToolbar } from '../../../../components/dataToolbar';
import type { Filter } from '../../../../utils/filter';

interface PvcToolbarOwnProps {
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: Query;
}

interface PvcToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type PvcToolbarProps = PvcToolbarOwnProps & WrappedComponentProps;

class PvcToolbarBase extends React.Component<PvcToolbarProps, PvcToolbarState> {
  protected defaultState: PvcToolbarState = {};
  public state: PvcToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { intl } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'persistent_volume_claim' }),
        key: 'persistentvolumeclaim',
        placeholderKey: 'persistent_volume_claim',
      },
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'storage_class' }), key: 'storageclass' },
    ];
    return options;
  };

  public render() {
    const { isDisabled, itemsPerPage, itemsTotal, onFilterAdded, onFilterRemoved, pagination, query } = this.props;
    const { categoryOptions } = this.state;

    return (
      <BasicToolbar
        categoryOptions={categoryOptions}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        showFilter
        useActiveFilters
      />
    );
  }
}

const PvcToolbar = injectIntl(PvcToolbarBase);

export { PvcToolbar };
