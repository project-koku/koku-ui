import { Tooltip } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface ReadOnlyTooltipBase {
  tooltip?: string;
  children: JSX.Element;
  isDisabled: boolean;
}

const ReadOnlyTooltip: React.FC<ReadOnlyTooltipBase> = ({ children, tooltip, isDisabled }) => {
  const intl = useIntl();
  const content = tooltip ? tooltip : intl.formatMessage(messages.readOnlyPermissions);

  return isDisabled ? (
    <Tooltip isContentLeftAligned content={<div>{content}</div>}>
      <div aria-label={intl.formatMessage(messages.readOnly)}>{children}</div>
    </Tooltip>
  ) : (
    children
  );
};

export { ReadOnlyTooltip };
