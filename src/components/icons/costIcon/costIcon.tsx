import './costIcon.scss';

import React from 'react';

interface CostIconProps {
  className?: string;
}

const icon = require('./Cost-icon.svg');

const CostIcon: React.SFC<CostIconProps> = ({ className }) => {
  return <img className={`cost-icon ${className}`} src={icon} />;
};

export default CostIcon;
