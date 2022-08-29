import {
  global_BackgroundColor_light_100,
  global_danger_color_100,
  global_disabled_color_100,
  global_FontSize_xs,
  global_spacer_3xl,
  global_spacer_xs,
  global_success_color_100,
} from '@patternfly/react-tokens';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  emptyState: {
    backgroundColor: global_BackgroundColor_light_100.value,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: global_spacer_3xl.value,
    height: '35vh',
    width: '100%',
  },
  infoArrow: {
    position: 'relative',
  },
  infoArrowDesc: {
    bottom: global_spacer_xs.value,
  },
  infoDescription: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
  },
} as { [className: string]: React.CSSProperties };

export const monthOverMonthOverride = css`
  div {
    display: block;
    margin-right: 0;
    margin-bottom: ${global_spacer_xs.value};
    &.iconOverride {
      &.decrease {
        color: ${global_success_color_100.value};
      }
      &.increase {
        color: ${global_danger_color_100.value};
      }
      .fa-sort-up,
      .fa-sort-down {
        margin-left: 10px;
      }
      .fa-sort-up::before {
        color: ${global_danger_color_100.value};
      }
      .fa-sort-down::before {
        color: ${global_success_color_100.value};
      }
      span {
        margin-right: -17px !important;
      }
    }
  }
`;

export const tableOverride = css`
  &.pf-c-table {
    &.tag {
      tbody td + td + td {
        text-align: right;
      }
    }
    thead th + th {
      .pf-c-button {
        text-align: right;
      }
      text-align: right;
    }
    tbody td + td + td + td {
      text-align: right;
    }
    td {
      vertical-align: top;
    }
  }
`;
