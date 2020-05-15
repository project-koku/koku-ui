import { Tooltip } from '@patternfly/react-core';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface ReadOnlyTooltipBase extends WrappedComponentProps {
  children: JSX.Element;
  isDisabled: boolean;
}

export const ReadOnlyTooltipBase: React.SFC<ReadOnlyTooltipBase> = ({
  children,
  intl,
  isDisabled,
}) => {
  return isDisabled ? (
    <Tooltip
      isContentLeftAligned
      content={
        <div>{intl.formatMessage({ id: 'cost_models.read_only_tooltip' })}</div>
      }
    >
      <div data-testid="read-only-tooltip">{children}</div>
    </Tooltip>
  ) : (
    children
  );
};

export const ReadOnlyTooltip = injectIntl(ReadOnlyTooltipBase);
