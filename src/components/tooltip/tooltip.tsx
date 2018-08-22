import React from 'react';

import {
  Icon,
  OverlayTrigger,
  Popover,
  Tooltip as PFTooltip,
} from 'patternfly-react';
import PropTypes from 'prop-types';

import helpers from '../../utils/helpers';

const Tooltip: any = ({
  children,
  tooltip,
  id,
  placement,
  popover,
  rootClose,
  trigger,
  delayShow,
  ...props
}) => {
  const setId = id || helpers.generateId(null);

  const tooltipPopover = popover ? (
    <Popover id={setId} {...props}>
      {popover}
    </Popover>
  ) : (
    <PFTooltip id={setId} {...props}>
      {tooltip || 'example tooltip'}
    </PFTooltip>
  );

  return (
    <OverlayTrigger
      overlay={tooltipPopover}
      placement={placement}
      trigger={trigger}
      delayShow={delayShow}
      rootClose={rootClose}
    >
      <span>{children || <Icon type="pf" name="info" />}</span>
    </OverlayTrigger>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node,
  popover: PropTypes.node,
  tooltip: PropTypes.node,
  id: PropTypes.string,
  placement: PropTypes.string,
  rootClose: PropTypes.bool,
  trigger: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  delayShow: PropTypes.number,
};

Tooltip.defaultProps = {
  children: null,
  popover: null,
  tooltip: null,
  id: null,
  placement: 'top',
  rootClose: true,
  trigger: ['hover'],
  delayShow: 500,
};

export { Tooltip as default, Tooltip };
