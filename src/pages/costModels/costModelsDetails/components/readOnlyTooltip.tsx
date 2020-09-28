import { Tooltip } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface ReadOnlyTooltipBase extends InjectedTranslateProps {
  children: JSX.Element;
  isDisabled: boolean;
}

export const ReadOnlyTooltipBase: React.SFC<ReadOnlyTooltipBase> = ({ children, t, isDisabled }) => {
  return isDisabled ? (
    <Tooltip isContentLeftAligned content={<div>{t('cost_models.read_only_tooltip')}</div>}>
      <div data-testid="read-only-tooltip">{children}</div>
    </Tooltip>
  ) : (
    children
  );
};

export const ReadOnlyTooltip = translate()(ReadOnlyTooltipBase);
