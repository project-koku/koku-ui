import { Button, ButtonVariant, Popover, TextContent, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from 'store';

interface HeaderProps {
  children: React.ReactNode;
}

function HeaderBase({ children }: HeaderProps): JSX.Element {
  return (
    <TextContent>
      <Title headingLevel="h1" size={TitleSizes['2xl']}>
        {children}
      </Title>
    </TextContent>
  );
}

const mapStateToProps = (state: RootState, ownProps: WithTranslation) => {
  const { t } = ownProps;

  const children = (
    <>
      {t('page_cost_models.header_title')}
      <Popover
        aria-label="page header popver"
        bodyContent={
          <Trans i18nKey="page_cost_models.header_popover">
            <a href={t('docs.using_cost_models')} rel="noreferrer" target="_blank" />
          </Trans>
        }
        enableFlip
      >
        <Button variant={ButtonVariant.plain}>
          <OutlinedQuestionCircleIcon />
        </Button>
      </Popover>
    </>
  );
  return { children };
};

const Header = withTranslation()(connect(mapStateToProps)(HeaderBase));

export default Header;
