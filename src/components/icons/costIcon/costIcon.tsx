import './costIcon.scss';

import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface CostIconProps extends WithTranslation {
  className?: string;
}

const icon = require('./Cost-icon.svg');

const CostIcon: React.SFC<CostIconProps> = ({ className, t }) => {
  return <img className={`cost-icon ${className}`} src={icon} alt={t('cost_management')} aria-hidden="true" />;
};

export default withTranslation()(CostIcon);
