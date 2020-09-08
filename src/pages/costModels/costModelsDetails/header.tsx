import { Button, ButtonVariant, Popover, Title } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import React from 'react';
import { styles } from './costModelsDetails.styles';
import { I18n } from 'react-i18next';
import { TranslationFunction } from 'i18next';

interface HeaderProps {
  title: string;
  popover: string;
}

const translateHeaderProps = (t: TranslationFunction, props: HeaderProps) => {
  return {
    title: t(props.title),
    popover: t(props.popover),
  };
};

const Header: React.FunctionComponent<HeaderProps> = props => {
  return (
    <I18n>
      {t => {
        const translatedProps = translateHeaderProps(t, props);
        const { title, popover } = translatedProps;
        return (
          <header style={styles.header}>
            <Title headingLevel="h2" style={styles.title} size="2xl">
              {title}
              <Popover
                aria-label={'cost-models-popover'}
                bodyContent={popover}
                enableFlip
              >
                <Button variant={ButtonVariant.plain}>
                  <InfoCircleIcon />
                </Button>
              </Popover>
            </Title>
          </header>
        );
      }}
    </I18n>
  );
};

export default Header;
