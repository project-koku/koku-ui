import './dataToolbar.scss';

import type { SelectOptionObject, ToolbarChipGroup } from '@patternfly/react-core';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

interface WorkloadTypeOwnProps {
  isDisabled?: boolean;
  onSelect(event, selection);
  selections?: SelectOptionObject[];
}

interface WorkloadTypeState {
  isWorkloadTypeExpanded?: boolean;
  tagKeyValueInput?: string;
}

type WorkloadTypeProps = WorkloadTypeOwnProps & RouterComponentProps & WrappedComponentProps;

class WorkloadTypeBase extends React.Component<WorkloadTypeProps, WorkloadTypeState> {
  protected defaultState: WorkloadTypeState = {
    isWorkloadTypeExpanded: false,
  };
  public state: WorkloadTypeState = { ...this.defaultState };

  private getOptions = (): ToolbarChipGroup[] => {
    const options = [
      { name: 'daemonset', key: 'daemonset' },
      { name: 'deployment', key: 'deployment' },
      { name: 'deploymentconfig', key: 'deploymentconfig' },
      { name: 'replicaset', key: 'replicaset' },
      { name: 'replicationcontroller', key: 'replicationcontroller' },
      { name: 'statefulset', key: 'statefulset' },
    ];
    return options;
  };

  private onToggle = isOpen => {
    this.setState({
      isWorkloadTypeExpanded: isOpen,
    });
  };

  public render() {
    const { intl, isDisabled, onSelect, selections } = this.props;
    const { isWorkloadTypeExpanded } = this.state;

    const selectOptions = this.getOptions().map(selectOption => {
      return <SelectOption key={selectOption.key} value={selectOption.key} />;
    });

    return (
      <Select
        className="selectOverride"
        isDisabled={isDisabled}
        variant={SelectVariant.checkbox}
        aria-label={intl.formatMessage(messages.filterByWorkloadTypeAriaLabel)}
        onToggle={this.onToggle}
        onSelect={onSelect}
        selections={selections}
        isOpen={isWorkloadTypeExpanded}
        placeholderText={intl.formatMessage(messages.chooseValuePlaceholder)}
      >
        {selectOptions}
      </Select>
    );
  }
}

const WorkloadType = injectIntl(withRouter(WorkloadTypeBase));

export { WorkloadType };
