import { Button, ButtonVariant, Popover, TextContent, Title, TitleSizes } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { RootState } from 'store';

import { styles } from './header.styles';

interface HeaderProps {
  children: React.ReactNode;
}

function HeaderBase({ children }: HeaderProps): JSX.Element {
  return (
    <div style={styles.headerContent}>
      <TextContent>
        <Title headingLevel="h1" size={TitleSizes['2xl']}>
          {children}
        </Title>
      </TextContent>
    </div>
  );
}

const mapStateToProps = (state: RootState, ownProps: WrappedComponentProps) => {
  const { intl } = ownProps;

  const children = (
    <>
      {intl.formatMessage(messages.costModels)}
      <Popover
        aria-label={intl.formatMessage(messages.costModelsPopoverAriaLabel)}
        bodyContent={intl.formatMessage(messages.costModelsPopover, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsUsingCostModels)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
        enableFlip
      >
        <Button
          aria-label={intl.formatMessage(messages.costModelsPopoverButtonAriaLabel)}
          variant={ButtonVariant.plain}
        >
          <OutlinedQuestionCircleIcon />
        </Button>
      </Popover>
    </>
  );
  return { children };
};

const Header = injectIntl(connect(mapStateToProps)(HeaderBase));

export default Header;
