import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_BackgroundColor_200,
  global_Color_100,
  global_Color_200,
  global_Color_disabled,
  global_Color_light_100,
  global_Color_light_200,
  global_FontSize_sm,
  global_FontSize_xs,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  content: {
    padding: `0 ${global_spacer_xl.value}`,
  },
  costDetailsPage: {
    backgroundColor: global_BackgroundColor_200.var,
    minHeight: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: global_spacer_xl.var,
    backgroundColor: global_BackgroundColor_100.var,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  '.list-view-pf-checkbox': {
    display: 'inline-flex',
  },
  '.list-view-pf-description': {
    display: 'inline-flex',
    marginLeft: '1rem',
  },
  total: {
    display: 'flex',
    alignItems: 'center',
  },
  totalLabel: {},
  totalValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  totalLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  totalLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  innerGroupBySelector: {
    display: 'flex',
    alignItems: 'center',
    fontSize: global_FontSize_sm.value,
  },
  innerGroupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
});

export const listViewOverride = css`
  min-height: 100%;
  padding: ${global_spacer_xl.value};
  background-color: ${global_Color_light_200.value};
  ${global_Color_100.name}: ${global_Color_light_100.value};
  ${global_Color_200.name}: ${global_Color_light_200.value};

  & .list-view-pf-main-info {
    display: block;
  }
  & .list-view-pf-description {
    display: inline-flex;
    margin-left: 1rem;
  }
  & .list-view-pf-additional-info {
    float: right;
  }
  .list-view-pf-expand {
    float: left;
    margin-right: 1rem;
  }
  .list-view-pf-checkbox {
    float: left;
  }
  .list-view-pf-additional-info strong {
    position: relative;
  }
  .list-view-pf-additional-info span {
    font-size: ${global_FontSize_xs.value};
    color: ${global_Color_disabled.value};
    top: 1rem;
    position: relative;
    right: 3.5rem;
  }
`;
