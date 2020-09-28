import global_BackgroundColor_light_100 from '@patternfly/react-tokens/dist/js/global_BackgroundColor_light_100';
import global_danger_color_100 from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import global_disabled_color_100 from '@patternfly/react-tokens/dist/js/global_disabled_color_100';
import global_FontSize_xs from '@patternfly/react-tokens/dist/js/global_FontSize_xs';
import global_spacer_3xl from '@patternfly/react-tokens/dist/js/global_spacer_3xl';
import global_spacer_xs from '@patternfly/react-tokens/dist/js/global_spacer_xs';
import global_success_color_100 from '@patternfly/react-tokens/dist/js/global_success_color_100';
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
    thead th + th + th + th {
      .pf-c-table__button {
        margin-left: auto;
      }
      text-align: right;
    }
    tbody td + td + td + td {
      text-align: right;
    }
  }
`;
