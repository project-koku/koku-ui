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
    </header>
  );
};

export { OptimizationsDetailsHeader };
