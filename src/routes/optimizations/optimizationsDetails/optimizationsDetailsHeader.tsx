import { Button, ButtonVariant, Popover, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { styles } from './optimizationsDetailsHeader.styles';

interface OptimizationsDetailsHeaderOwnProps {
  // TBD...
}

type OptimizationsDetailsHeaderProps = OptimizationsDetailsHeaderOwnProps;

const OptimizationsDetailsHeader: React.FC<OptimizationsDetailsHeaderProps> = () => {
  const intl = useIntl();

  return (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <Title headingLevel="h1" style={styles.title} size={TitleSizes['2xl']}>
          {intl.formatMessage(messages.optimizations)}
          <span style={styles.infoIcon}>
            <Popover
              aria-label={intl.formatMessage(messages.optimizationsInfoArialLabel)}
              enableFlip
              bodyContent={<p style={styles.infoTitle}>{intl.formatMessage(messages.optimizationsInfo)}</p>}
            >
              <Button
                aria-label={intl.formatMessage(messages.optimizationsInfoButtonArialLabel)}
                variant={ButtonVariant.plain}
              >
                <OutlinedQuestionCircleIcon />
              </Button>
            </Popover>
          </span>
        </Title>
      </div>
    </header>
  );
};

export { OptimizationsDetailsHeader };
