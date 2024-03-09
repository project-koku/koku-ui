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

interface ParentTagsToolbarOwnProps {
  enabledTagsCount?: number;
  enabledTagsLimit?: number;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isPrimaryActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  selectedItems?: SettingsData[];
  query?: Query;
}

interface ParentTagsToolbarStateProps {
  // TBD...
}

interface ParentTagsToolbarDispatchProps {
  // TBD...
}

interface ParentTagsToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
}

type ParentTagsToolbarProps = ParentTagsToolbarOwnProps &
  ParentTagsToolbarStateProps &
  ParentTagsToolbarDispatchProps &
  WrappedComponentProps;

class ParentTagsToolbarBase extends React.Component<ParentTagsToolbarProps, ParentTagsToolbarState> {
  protected defaultState: ParentTagsToolbarState = {};
  public state: ParentTagsToolbarState = { ...this.defaultState };

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
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        selectedItems={selectedItems}
        showFilter
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ParentTagsToolbarOwnProps, ParentTagsToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: ParentTagsToolbarDispatchProps = {
  // TBD...
};

const ParentTagsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ParentTagsToolbarBase);
const ParentTagsToolbar = injectIntl(ParentTagsToolbarConnect);

export { ParentTagsToolbar };
