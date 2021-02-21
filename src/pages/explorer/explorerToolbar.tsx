import { ToolbarChipGroup } from '@patternfly/react-core';
import { DataToolbar } from 'pages/details/components/dataToolbar/dataToolbar';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { ComputedReportItem } from 'utils/computedReport/getComputedReportItems';

interface ExplorerToolbarOwnProps {
  isAllSelected?: boolean;
  isBulkSelectDisabled?: boolean;
  isExportDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onBulkSelected(action: string);
  onExportClicked();
  pagination?: React.ReactNode;
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
  WithTranslation;

export class ExplorerToolbarBase extends React.Component<ExplorerToolbarProps> {
  protected defaultState: ExplorerToolbarState = {};
  public state: ExplorerToolbarState = { ...this.defaultState };

  public render() {
    const {
      isAllSelected,
      isBulkSelectDisabled,
      isExportDisabled,
      itemsPerPage,
      itemsTotal,
      onBulkSelected,
      onExportClicked,
      pagination,
      selectedItems,
    } = this.props;

    return (
      <DataToolbar
        isAllSelected={isAllSelected}
        isBulkSelectDisabled={isBulkSelectDisabled}
        isExportDisabled={isExportDisabled}
        itemsPerPage={itemsPerPage}
        itemsTotal={itemsTotal}
        onBulkSelected={onBulkSelected}
        onExportClicked={onExportClicked}
        pagination={pagination}
        selectedItems={selectedItems}
        showBulkSelect
        showExport
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
const ExplorerToolbar = withTranslation()(ExplorerToolbarConnect);

export { ExplorerToolbar, ExplorerToolbarProps };
