import messages from '@koku-ui/i18n/locales/messages';
import { Tooltip } from '@patternfly/react-core';
import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import { useIntl } from 'react-intl';

interface ReadOnlyTooltipBase {
  defaultMsg?: MessageDescriptor;
  children: JSX.Element;
  isDisabled?: boolean;
}

const ReadOnlyTooltip: React.FC<ReadOnlyTooltipBase> = ({ children, defaultMsg, isDisabled }) => {
  const intl = useIntl();

  const getChildren = () => {
    if (isDisabled) {
      return <div aria-label={intl.formatMessage(messages.readOnly)}>{children}</div>;
    }
    return children;
  };

  if (defaultMsg || isDisabled) {
    const msg = intl.formatMessage(isDisabled ? messages.readOnly : defaultMsg);
    return (
      <Tooltip isContentLeftAligned content={msg}>
        {getChildren()}
      </Tooltip>
    );
  }
  return children;
};

export { ReadOnlyTooltip };
