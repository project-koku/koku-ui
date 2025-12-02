import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../store/common';
import { DataToolbar } from '../components/dataToolbar';
import type { ComputedReportItem } from '../utils/computedReport/getComputedReportItems';
import type { PerspectiveType } from './explorerUtils';
import { getTagReportPathsType } from './explorerUtils';

interface ExplorerToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isDisabled?: boolean;
  isExportDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelect(action: string);
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
  // TBD...
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
      onBulkSelect,
      onExportClicked,
      pagination,
      perspective,
      selectedItems,
    } = this.props;

    const tagPathsType = getTagReportPathsType(perspective);

    // Note: This is the table toolbar used for bulk select and pagination, not the filter toolbar in the page header
    return (
      <DataToolbar
        isAllSelected={isAllSelected}
        isBulkSelectDisabled={isBulkSelectDisabled}
        isDisabled={isDisabled}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelect={onBulkSelect}
        onExportClicked={onExportClicked}
        pagination={pagination}
        selectedItems={selectedItems}
        showBulkSelect
        showCriteria
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
