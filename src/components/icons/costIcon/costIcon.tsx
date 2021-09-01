import './costIcon.scss';

import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface CostIconProps extends WrappedComponentProps {
  className?: string;
}

const icon = require('./Cost-icon.svg');

const CostIcon: React.SFC<CostIconProps> = ({ className, intl }) => {
  return (
    <img
      className={`cost-icon ${className}`}
      src={icon}
      alt={intl.formatMessage(messages.CostManagement)}
      aria-hidden="true"
    />
  );
};

export default injectIntl(CostIcon);
