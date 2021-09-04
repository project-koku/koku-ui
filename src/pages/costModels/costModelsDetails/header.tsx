import { Button, ButtonVariant, Popover, TextContent, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
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

const mapStateToProps = (state: RootState, ownProps: WrappedComponentProps) => {
  const { intl } = ownProps;

  const children = (
    <>
      {intl.formatMessage(messages.CostModels)}
      <Popover
        aria-label="page header popver"
        bodyContent={intl.formatMessage(messages.CostModelsPopover, {
          learnMore: (
            <a href={intl.formatMessage(messages.DocsUsingCostModels)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.LearnMore)}
            </a>
          ),
        })}
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

const Header = injectIntl(connect(mapStateToProps)(HeaderBase));

export default Header;
