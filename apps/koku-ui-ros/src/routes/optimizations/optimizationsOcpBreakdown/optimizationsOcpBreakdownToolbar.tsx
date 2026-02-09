import { Flex, FlexItem } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import messages from 'locales/messages';
import React from 'react';
import { PerspectiveSelect } from 'routes/components/perspective/perspectiveSelect';
import { Interval, OptimizationType } from 'utils/commonTypes';

interface optimizationsOcpBreakdownToolbarOwnProps {
  currentInterval?: Interval;
  onIntervalSelect?: (value: Interval) => void;
  onOptimizationTypeSelect?: (value: OptimizationType) => void;
  query?: Query;
  optimizationType?: OptimizationType;
}

type optimizationsOcpBreakdownToolbarProps = optimizationsOcpBreakdownToolbarOwnProps;

const OptimizationsOcpBreakdownToolbar: React.FC<optimizationsOcpBreakdownToolbarProps> = ({
  currentInterval,
  onIntervalSelect,
  onOptimizationTypeSelect,
  optimizationType,
}) => {
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
    <Flex>
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
  );
};

export { OptimizationsOcpBreakdownToolbar };
