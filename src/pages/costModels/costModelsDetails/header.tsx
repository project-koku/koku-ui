import { Button, ButtonVariant, Popover, TextContent, Title } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from 'store';

interface HeaderProps {
  children: React.ReactNode;
}

function HeaderBase({ children }: HeaderProps): JSX.Element {
  return (
    <TextContent>
      <Title headingLevel="h1" size="2xl">
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
      <Popover aria-label="page header popver" bodyContent={t('page_cost_models.header_popover')} enableFlip>
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
