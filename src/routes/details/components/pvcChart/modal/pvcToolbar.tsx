import type { ToolbarChipGroup } from '@patternfly/react-core';
import type { RosQuery } from 'api/queries/rosQuery';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';

interface PvcToolbarOwnProps {
  isDisabled?: boolean;
  isProject?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: RosQuery;
}

interface PvcToolbarState {
  categoryOptions?: ToolbarChipGroup[];
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

  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl, isProject } = this.props;

    const options = [
      {
        name: intl.formatMessage(messages.filterByValues, { value: 'persistent_volume_claim' }),
        key: 'persistentvolumeclaim',
        placeholderKey: 'persistent_volume_claim',
      },
      { name: intl.formatMessage(messages.filterByValues, { value: 'cluster' }), key: 'cluster' },
      // Todo: Not currently supported by API
      // { name: intl.formatMessage(messages.filterByValues, { value: 'storage_class' }), key: 'storage_class' },
    ];
    return isProject ? options : options.filter(option => option.key !== 'project');
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
