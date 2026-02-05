import { Divider, Flex, FlexItem, ToggleGroup, ToggleGroupItem } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { RosNamespace } from 'api/ros/ros';
import messages from 'locales/messages';
import React from 'react';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';
import { Interval, OptimizationType } from 'utils/commonTypes';

import { styles } from './optimizationsDetailsToolbar.styles';

interface OptimizationsDetailsToolbarOwnProps {
  currentInterval?: Interval;
  namespace?: RosNamespace;
  onIntervalSelect?: (value: Interval) => void;
  onNamespaceSelect?: (value: RosNamespace) => void;
  onOptimizationTypeSelect?: (value: OptimizationType) => void;
  query?: Query;
  optimizationType?: OptimizationType;
}

type OptimizationsDetailsToolbarProps = OptimizationsDetailsToolbarOwnProps;

const OptimizationsDetailsToolbar: React.FC<OptimizationsDetailsToolbarProps> = ({
  currentInterval,
  namespace,
  onIntervalSelect,
  onNamespaceSelect,
  onOptimizationTypeSelect,
  optimizationType,
}) => {
  const handleOnNamespaceSelect = event => {
    if (onNamespaceSelect) {
      onNamespaceSelect(event.currentTarget.id);
    }
  };

  const getOptimizationTypeOptions = () => {
    return [
      {
        label: messages.performance,
        value: OptimizationType.performance,
      },
      {
        label: messages.cost,
        value: OptimizationType.cost,
      },
    ];
  };

  const getIntervalOptions = () => {
    return [
      {
        label: messages.optimizationsShortTerm,
        value: Interval.short_term,
      },
      {
        label: messages.optimizationsMediumTerm,
        value: Interval.medium_term,
      },
      {
        label: messages.optimizationsLongTerm,
        value: Interval.long_term,
      },
    ];
  };

  const intervalOptions = getIntervalOptions();
  const optimizationTypeOptions = getOptimizationTypeOptions();

  return (
    <>
      <Divider style={styles.divider} />
      <Flex style={styles.toolbarContainer}>
        <FlexItem>
          <ToggleGroup aria-label="Default with single selectable">
            <ToggleGroupItem
              text="Projects"
              buttonId="projects"
              isSelected={namespace === RosNamespace.projects}
              onChange={event => handleOnNamespaceSelect(event)}
            />
            <ToggleGroupItem
              text="Containers"
              buttonId="containers"
              isSelected={namespace === RosNamespace.containers}
              onChange={event => handleOnNamespaceSelect(event)}
            />
          </ToggleGroup>
        </FlexItem>
        <FlexItem>
          <PerspectiveSelect
            currentItem={optimizationType || optimizationTypeOptions[0].value}
            onSelect={onOptimizationTypeSelect}
            options={optimizationTypeOptions}
            title={messages.optimizeFor}
          />
        </FlexItem>
        <FlexItem>
          <PerspectiveSelect
            currentItem={currentInterval || intervalOptions[0].value}
            onSelect={onIntervalSelect}
            options={intervalOptions}
            title={messages.optimizationsType}
          />
        </FlexItem>
      </Flex>
    </>
  );
};

export { OptimizationsDetailsToolbar };
