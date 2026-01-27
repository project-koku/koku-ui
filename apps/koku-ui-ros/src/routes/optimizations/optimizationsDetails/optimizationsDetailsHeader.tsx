import { Button, ButtonVariant, Popover, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import type { RosNamespace } from 'api/ros/ros';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import type { Interval, OptimizationType } from 'utils/commonTypes';

import { styles } from './optimizationsDetailsHeader.styles';
import { OptimizationsDetailsToolbar } from './optimizationsDetailsToolbar';

export interface OptimizationsDetailsHeaderStateProps {
  isNamespaceToggleEnabled?: boolean;
}

interface OptimizationsDetailsHeaderOwnProps {
  currentInterval: Interval;
  namespace: RosNamespace;
  onIntervalSelect?: (value: Interval) => void;
  onNamespaceSelect?: (value: RosNamespace) => void;
  onOptimizationTypeSelect?: (value: OptimizationType) => void;
  optimizationType?: OptimizationType;
}

type OptimizationsDetailsHeaderProps = OptimizationsDetailsHeaderOwnProps;

const OptimizationsDetailsHeader: React.FC<OptimizationsDetailsHeaderProps> = ({
  currentInterval,
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
      <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
        {intl.formatMessage(messages.optimizations)}
        <span style={styles.infoIcon}>
          <Popover
            aria-label={intl.formatMessage(messages.optimizationsInfoArialLabel)}
            enableFlip
            bodyContent={
              <>
                <p>{intl.formatMessage(messages.optimizationsInfoTitle)}</p>
                <br />
                <p>
                  {intl.formatMessage(messages.optimizationsInfoDesc, {
                    learnMore: (
                      <a href={intl.formatMessage(messages.docsOptimizations)} rel="noreferrer" target="_blank">
                        {intl.formatMessage(messages.learnMore)}
                      </a>
                    ),
                  })}
                </p>
              </>
            }
          >
            <Button
              icon={<OutlinedQuestionCircleIcon />}
              aria-label={intl.formatMessage(messages.optimizationsInfoButtonArialLabel)}
              variant={ButtonVariant.plain}
            />
          </Popover>
        </span>
      </Title>
      {isNamespaceToggleEnabled && (
        <>
          {intl.formatMessage(messages.optimizationsDesc)}
          <OptimizationsDetailsToolbar
            currentInterval={currentInterval}
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
