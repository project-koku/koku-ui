import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_BackgroundColor_200,
  global_BackgroundColor_300,
  global_Color_100,
  global_Color_200,
  global_Color_light_100,
  global_Color_light_200,
  global_disabled_color_100,
  global_FontSize_md,
  global_FontSize_sm,
  global_FontSize_xs,
  global_spacer_md,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: global_BackgroundColor_300.value,
    paddingTop: global_spacer_xl.value,
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
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_300.value,
  },
});

export const listViewOverride = css`
  min-height: 100%;
  padding: 0 ${global_spacer_xl.value};
  background-color: ${global_Color_light_200.value};
  font-size: ${global_FontSize_md.value};
  ${global_Color_100.name}: ${global_Color_light_100.value};
  ${global_Color_200.name}: ${global_Color_light_200.value};

  & .list-group .list-group-item:first-child {
    border-top: 0;
    padding-left: 2.25rem;
  }
  & .list-group-item-container {
    padding-left: 2.25rem;
  }
  & .list-group-item-heading {
    font-size: initial;
  }
  & .list-view-pf-view {
    margin-top: 0;
  }
  & .list-view-pf-additional-info-item strong {
    // position: relative;
    font-size: initial;
  }
  & .list-view-pf-additional-info-item span {
    font-size: ${global_FontSize_xs.value};
    color: ${global_disabled_color_100.value};
    top: 1rem;
  }
  & .list-view-pf-description {
    padding-top: 0.45rem;
  }
`;

export const toolbarOverride = css`
  margin-left: ${global_spacer_xl.value};
  margin-right: ${global_spacer_xl.value};
  padding-top: ${global_spacer_md.value};
  background-color: ${global_Color_light_100.value};
  font-size: ${global_FontSize_xs.value};

  .toolbar-pf {
    padding-top: 0;
  }
  .toolbar-pf-actions {
    display: flex;
  }
  .input-group {
    margin-right: 2rem;
  }
  .fa-download {
    padding-top: 0.5rem;
    padding-left: 1.5rem;
  }
  .btn {
    line-height: 28px;
  }
  .pf-remove-button .pficon-close {
    font-size: 75%;
  }
`;
