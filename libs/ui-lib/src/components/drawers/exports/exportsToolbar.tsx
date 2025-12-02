import type { Query } from '@koku-ui/api/queries/query';
import messages from '@koku-ui/i18n/locales/messages';
import type { ToolbarLabelGroup } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { DataToolbar } from '../../../routes/components/dataToolbar';
import type { Filter } from '../../../routes/utils/filter';
import { createMapStateToProps } from '../../../store/common';
import { styles } from './exports.styles';

interface ExportsToolbarOwnProps {
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  pagination?: React.ReactNode;
  query?: Query;
}

interface ExportsToolbarStateProps {
  // TDB...
}

interface ExportsToolbarDispatchProps {
  // TDB...
}

type ExportsToolbarProps = ExportsToolbarOwnProps &
  ExportsToolbarStateProps &
  ExportsToolbarDispatchProps &
  WrappedComponentProps;

export class ExportsToolbarBase extends React.Component<ExportsToolbarProps, any> {
  private getCategoryOptions = (): ToolbarLabelGroup[] => {
    const { intl } = this.props;

    return [{ name: intl.formatMessage(messages.filterByValues, { value: 'name' }), key: 'name' }];
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
        style={styles.toolbarContainer}
      />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<ExportsToolbarOwnProps, ExportsToolbarStateProps>((state, props) => {
  return {};
});

const mapDispatchToProps: ExportsToolbarDispatchProps = {};

const ExportsToolbarConnect = connect(mapStateToProps, mapDispatchToProps)(ExportsToolbarBase);
const ExportsToolbar = injectIntl(ExportsToolbarConnect);

export { ExportsToolbar };
export type { ExportsToolbarProps };
