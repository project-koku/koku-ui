import { Tooltip } from '@patternfly/react-core';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface ReadOnlyTooltipBase extends WithTranslation {
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

export const ReadOnlyTooltip = withTranslation()(ReadOnlyTooltipBase);
