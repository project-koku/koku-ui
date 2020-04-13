import { Button, ButtonVariant, Popover, Title } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { styles } from './costModelsDetails.styles';

const Header: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <header style={styles.header}>
    <Title style={styles.title} size="2xl">
      {t('cost_models_details.header.title')}
      <Popover
        aria-label={t('cost_models_details.header.sub')}
        enableFlip
        bodyContent={t('cost_models_details.header.sub')}
      >
        <Button variant={ButtonVariant.plain}>
          <InfoCircleIcon />
        </Button>
      </Popover>
    </Title>
  </header>
);

export default Header;
