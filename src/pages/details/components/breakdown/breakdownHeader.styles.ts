import {
  global_BackgroundColor_100,
  global_Color_200,
  global_disabled_color_100,
  global_FontSize_sm,
  global_FontSize_xs,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_xl,
  global_spacer_xs,
} from '@patternfly/react-tokens';
import { css } from 'emotion';
import React from 'react';

export const styles = {
  cost: {
    marginTop: global_spacer_xl.var,
  },
  costLabel: {
    marginTop: global_spacer_xs.var,
  },
  costValue: {
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'right',
  },
  costLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
    textAlign: 'right',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingLeft: global_spacer_xl.var,
    paddingRight: global_spacer_xl.var,
    paddingTop: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_100.var,
  },
  infoDescription: {
    color: global_disabled_color_100.value,
    fontSize: global_FontSize_xs.value,
  },
  tabs: {
    display: 'flex',
  },
  tag: {
    marginLeft: global_spacer_lg.var,
  },
  title: {
    paddingBottom: global_spacer_lg.var,
    paddingTop: global_spacer_md.var,
  },
} as { [className: string]: React.CSSProperties };

export const breadcrumbOverride = css`
  .pf-c-breadcrumb__item:not(:last-child) {
    margin-left: var(--pf-c-breadcrumb__item--MarginRight);
    margin-right: 0;
  }
  .pf-c-breadcrumb__item-divider {
    margin-left: 0;
    margin-right: var(--pf-c-breadcrumb__item-divider--MarginLeft);
  }
`;
