import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import { TagMappingsWizard } from 'routes/settings/tagLabels/tagMappings/tagMappingsWizard';
import type { Filter } from 'routes/utils/filter';
import { createMapStateToProps } from 'store/common';

interface TagMappingsToolbarOwnProps {
  canWrite?: boolean;
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
  onWizardClose();
  pagination?: React.ReactNode;
  query?: Query;
}

interface TagMappingsToolbarStateProps {
  // TBD...
}

interface TagMappingsToolbarDispatchProps {
  // TBD...
}

interface TagMappingsToolbarState {
  categoryOptions?: ToolbarChipGroupExt[];
}

type TagMappingsToolbarProps = TagMappingsToolbarOwnProps &
  TagMappingsToolbarStateProps &
  TagMappingsToolbarDispatchProps &
  WrappedComponentProps;

class TagMappingsToolbarBase extends React.Component<TagMappingsToolbarProps, TagMappingsToolbarState> {
  protected defaultState: TagMappingsToolbarState = {};
  public state: TagMappingsToolbarState = { ...this.defaultState };

  public componentDidMount() {
    this.setState({
      categoryOptions: this.getCategoryOptions(),
    });
  }

  private getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const { intl } = this.props;

    const options = [
      {
        ariaLabelKey: 'tag_key_parent',
        placeholderKey: 'tag_key_parent',
        key: 'parent',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key_parent' }),
      },
      {
        ariaLabelKey: 'tag_key_child',
        placeholderKey: 'tag_key_child',
        key: 'child',
        name: intl.formatMessage(messages.filterByValues, { value: 'tag_key_child' }),
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
      canWrite,
      isAllSelected,
      isDisabled,
      itemsPerPage,
      itemsTotal,
      onFilterAdded,
      onFilterRemoved,
      onWizardClose,
      pagination,
      query,
    } = this.props;
    const { categoryOptions } = this.state;

    return (
      <BasicToolbar
        actions={<TagMappingsWizard canWrite={canWrite} isDisabled={isDisabled} onClose={onWizardClose} />}
        categoryOptions={categoryOptions}
        isAllSelected={isAllSelected}
        isDisabled={isDisabled}
        isReadOnly={!canWrite}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onFilterAdded={onFilterAdded}
        onFilterRemoved={onFilterRemoved}
        pagination={pagination}
        query={query}
        showFilter
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<TagMappingsToolbarOwnProps, TagMappingsToolbarStateProps>(() => {
  return {
    // TBD...
  };
});

const mapDispatchToProps: TagMappingsToolbarDispatchProps = {
  // TBD...
};

const TagMappingsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(TagMappingsToolbarBase);
const TagMappingsToolbar = injectIntl(TagMappingsToolbarConnect);

export { TagMappingsToolbar };
