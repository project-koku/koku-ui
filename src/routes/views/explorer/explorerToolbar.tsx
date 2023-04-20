import type { ToolbarChipGroup } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DataToolbar } from 'routes/views/components/dataToolbar';
import { createMapStateToProps } from 'store/common';
import type { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

import type { PerspectiveType } from './explorerUtils';
import { getTagReportPathsType } from './explorerUtils';

interface ExplorerToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected(action: string);
  onExportClicked();
  pagination?: React.ReactNode;
  perspective: PerspectiveType;
  selectedItems?: ComputedReportItem[];
}

interface ExplorerToolbarStateProps {
  // TBD...
}

interface ExplorerToolbarDispatchProps {
  // TBD...
}

interface ExplorerToolbarState {
  categoryOptions?: ToolbarChipGroup[];
}

type ExplorerToolbarProps = ExplorerToolbarOwnProps &
  ExplorerToolbarStateProps &
  ExplorerToolbarDispatchProps &
  WrappedComponentProps;

export class ExplorerToolbarBase extends React.Component<ExplorerToolbarProps, ExplorerToolbarState> {
  protected defaultState: ExplorerToolbarState = {};
  public state: ExplorerToolbarState = { ...this.defaultState };

  public render() {
    const {
      isAllSelected,
      isBulkSelectDisabled,
      isDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onExportClicked,
      pagination,
      perspective,
      selectedItems,
    } = this.props;

    const tagPathsType = getTagReportPathsType(perspective);

    return (
      <DataToolbar
        isAllSelected={isAllSelected}
        isBulkSelectDisabled={isBulkSelectDisabled}
        isDisabled={isDisabled}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onExportClicked={onExportClicked}
        pagination={pagination}
        selectedItems={selectedItems}
        showBulkSelect
        showExcludes
        showExport
        tagPathsType={tagPathsType}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExplorerToolbarOwnProps, ExplorerToolbarStateProps>((state, props) => {
  return {};
});

const mapDispatchToProps: ExplorerToolbarDispatchProps = {
  // TBD...
};

const ExplorerToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ExplorerToolbarBase);
const ExplorerToolbar = injectIntl(ExplorerToolbarConnect);

export { ExplorerToolbar };
export type { ExplorerToolbarProps };
