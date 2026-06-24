import type { RosNamespace } from 'api/ros/ros';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { Interval, OptimizationType } from 'utils/commonTypes';

import { styles } from './optimizationsDetailsHeader.styles';
import { OptimizationsDetailsTitle } from './optimizationsDetailsTitle';
import { OptimizationsDetailsToolbar } from './optimizationsDetailsToolbar';

export interface OptimizationsDetailsHeaderStateProps {
  isNamespaceToggleEnabled?: boolean;
}

interface OptimizationsDetailsHeaderOwnProps {
  interval: Interval;
  namespace: RosNamespace;
  onIntervalSelect?: (value: Interval) => void;
  onNamespaceSelect?: (value: RosNamespace) => void;
  onOptimizationTypeSelect?: (value: OptimizationType) => void;
  optimizationType?: OptimizationType;
}

type OptimizationsDetailsHeaderProps = OptimizationsDetailsHeaderOwnProps;

const OptimizationsDetailsHeader: React.FC<OptimizationsDetailsHeaderProps> = ({
  interval,
  namespace,
  onIntervalSelect,
  onNamespaceSelect,
  onOptimizationTypeSelect,
  optimizationType,
}) => {
  const intl = useIntl();
  const { isNamespaceToggleEnabled } = useMapToProps();

  return (
    <header style={styles.headerContainer}>
      <OptimizationsDetailsTitle />
      {isNamespaceToggleEnabled && (
        <>
          {intl.formatMessage(messages.optimizationsDesc)}
          <OptimizationsDetailsToolbar
            interval={interval}
            namespace={namespace}
            onIntervalSelect={onIntervalSelect}
            onNamespaceSelect={onNamespaceSelect}
            onOptimizationTypeSelect={onOptimizationTypeSelect}
            optimizationType={optimizationType}
          />
        </>
      )}
    </header>
  );
};

const useMapToProps = (): OptimizationsDetailsHeaderStateProps => {
  return {
    isNamespaceToggleEnabled: useIsNamespaceToggleEnabled(),
  };
};

export { OptimizationsDetailsHeader };
