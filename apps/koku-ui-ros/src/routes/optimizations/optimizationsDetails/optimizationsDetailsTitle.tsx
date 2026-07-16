import { Button, ButtonVariant, Popover, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import { useIsNamespaceToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { styles } from './optimizationsDetailsTitle.styles';

export interface OptimizationsDetailsTitleStateProps {
  // TBD...
}

interface OptimizationsDetailsTitleOwnProps {
  // TBD...
}

type OptimizationsDetailsTitleProps = OptimizationsDetailsTitleOwnProps;

const OptimizationsDetailsTitle: React.FC<OptimizationsDetailsTitleProps> = () => {
  const intl = useIntl();
  const isNamespaceToggleEnabled = useIsNamespaceToggleEnabled();

  return (
    <>
      <Title headingLevel="h1" style={!isNamespaceToggleEnabled ? styles.title : undefined} size={TitleSizes['2xl']}>
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
      {isNamespaceToggleEnabled && <div style={styles.titleDesc}>{intl.formatMessage(messages.optimizationsDesc)}</div>}
    </>
  );
};

export { OptimizationsDetailsTitle };
