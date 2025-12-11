import type { ToolbarLabelGroup } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { Filter } from 'routes/utils/filter';

interface GpuToolbarOwnProps {
  isDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: Query;
}

interface GpuToolbarState {
  categoryOptions?: ToolbarLabelGroup[];
}

type GpuToolbarProps = GpuToolbarOwnProps & WrappedComponentProps;

class GpuToolbarBase extends React.Component<GpuToolbarProps, GpuToolbarState> {
  protected defaultState: GpuToolbarState = {};
  public state: GpuToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { intl } = this.props;

    const options = [
      { name: intl.formatMessage(messages.filterByValues, { value: 'model' }), key: 'model' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'vendor' }), key: 'vendor' },
      { name: intl.formatMessage(messages.filterByValues, { value: 'node' }), key: 'node' },
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

const GpuToolbar = injectIntl(GpuToolbarBase);

export { GpuToolbar };
