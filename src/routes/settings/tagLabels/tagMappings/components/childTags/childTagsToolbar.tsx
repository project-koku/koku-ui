import type { Query } from 'api/queries/query';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

interface ChildTagsToolbarOwnProps {
  enabledTagsCount?: number;
  enabledTagsLimit?: number;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  selectedItems?: SettingsData[];
  query?: Query;
}

interface ChildTagsToolbarStateProps {
  // TBD...
}

interface ChildTagsToolbarDispatchProps {
  // TBD...
}

interface ChildTagsToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
}

type ChildTagsToolbarProps = ChildTagsToolbarOwnProps &
  ChildTagsToolbarStateProps &
  ChildTagsToolbarDispatchProps &
  WrappedComponentProps;

class ChildTagsToolbarBase extends React.Component<ChildTagsToolbarProps, ChildTagsToolbarState> {
  protected defaultState: ChildTagsToolbarState = {};
  public state: ChildTagsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const { intl } = this.props;

    const options = [
      {
        ariaLabelKey: 'tag_key',
        placeholderKey: 'tag_key',
        key: 'key',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key' }),
      },
      {
        key: 'source_type',
        name: intl.formatMessage(messages.filterByValues, { value: 'source_type' }),
        selectClassName: 'selectOverride', // A selector from routes/components/dataToolbar/dataToolbar.scss
        selectOptions: [
          {
            key: 'AWS',
            name: intl.formatMessage(messages.aws),
          },
          {
            key: 'Azure',
            name: intl.formatMessage(messages.azure),
          },
          {
            key: 'GCP',
            name: intl.formatMessage(messages.gcp),
          },
          // {
          //   key: 'IBM',
          //   name: intl.formatMessage(messages.ibm), // Todo: enable when supported by API
          // },
          {
            key: 'OCI',
            name: intl.formatMessage(messages.oci),
          },
          {
            key: 'OCP',
            name: intl.formatMessage(messages.openShift),
          },
        ],
      },
    ];
    return options;
  };

  public render() {
    const {
      isAllSelected,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelect,
      onFilterAdded,
      onFilterRemoved,
      pagination,
      query,
      selectedItems,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <BasicToolbar
        categoryOptions={categoryOptions}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelect={onBulkSelect}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        selectedItems={selectedItems}
        showBulkSelect
        showBulkSelectAll={false}
        showFilter
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ChildTagsToolbarOwnProps, ChildTagsToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: ChildTagsToolbarDispatchProps = {
  // TBD...
};

const ChildTagsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ChildTagsToolbarBase);
const ChildTagsToolbar = injectIntl(ChildTagsToolbarConnect);

export { ChildTagsToolbar };
