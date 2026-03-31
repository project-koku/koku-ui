import { Button, ButtonVariant, Popover, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { styles } from './optimizationsDetailsHeader.styles';

export interface OptimizationsDetailsTitleStateProps {
  // TBD...
}

interface OptimizationsDetailsTitleOwnProps {
  // TBD...
}

type OptimizationsDetailsTitleProps = OptimizationsDetailsTitleOwnProps;

const OptimizationsDetailsTitle: React.FC<OptimizationsDetailsTitleProps> = () => {
  const intl = useIntl();

  return (
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
  );
};

export { OptimizationsDetailsTitle };
