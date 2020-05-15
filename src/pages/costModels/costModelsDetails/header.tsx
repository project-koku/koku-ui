import { Button, ButtonVariant, Popover, Title } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import React from 'react';
import { WrappedComponentProps } from 'react-intl';
import { styles } from './costModelsDetails.styles';

const Header: React.SFC<WrappedComponentProps> = ({ intl }) => (
  <header style={styles.header}>
    <Title style={styles.title} size="2xl">
      {intl.formatMessage({ id: 'cost_models_details.header.title' })}
      <Popover
        aria-label={intl.formatMessage({
          id: 'cost_models_details.header.sub',
        })}
        enableFlip
        bodyContent={intl.formatMessage({
          id: 'cost_models_details.header.sub',
        })}
      >
        <Button variant={ButtonVariant.plain}>
          <InfoCircleIcon />
        </Button>
      </Popover>
    </Title>
  </header>
);

export default Header;
