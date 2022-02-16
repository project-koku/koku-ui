import { ToolbarChipGroup } from '@patternfly/react-core';
import { Query } from 'api/queries/query';
import messages from 'locales/messages';
import { DataToolbar } from 'pages/views/components/dataToolbar/dataToolbar';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';

interface ExportToolbarOwnProps {
  onFilterAdded(filterType: string, filterValue: string);
  onFilterRemoved(filterType: string, filterValue?: string);
  pagination?: React.ReactNode;
  query?: Query;
}

interface ExportToolbarStateProps {
  // TDB...
}

interface ExportToolbarDispatchProps {
  // TDB...
}

type ExportToolbarProps = ExportToolbarOwnProps &
  ExportToolbarStateProps &
  ExportToolbarDispatchProps &
  WrappedComponentProps;

export class ExportToolbarBase extends React.Component<ExportToolbarProps> {
  private getCategoryOptions = (): ToolbarChipGroup[] => {
    const { intl } = this.props;

    return [{ name: intl.formatMessage(messages.FilterByValues, { value: 'name' }), key: 'name' }];
  };

  public render() {
    const { onFilterAdded, onFilterRemoved, pagination, query } = this.props;

    return (
      <DataToolbar
        categoryOptions={this.getCategoryOptions()}
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
const mapStateToProps = createMapStateToProps<ExportToolbarOwnProps, ExportToolbarStateProps>((state, props) => {
  return {};
});

const mapDispatchToProps: ExportToolbarDispatchProps = {};

const ExportToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ExportToolbarBase);
const ExportToolbar = injectIntl(ExportToolbarConnect);

export { ExportToolbar, ExportToolbarProps };
