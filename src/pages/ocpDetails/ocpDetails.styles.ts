import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_100,
  global_BackgroundColor_300,
  global_BorderRadius_sm,
  global_BoxShadow_sm,
  global_Color_100,
  global_Color_200,
  global_Color_light_100,
  global_Color_light_200,
  global_danger_color_100,
  global_disabled_color_100,
  global_FontSize_lg,
  global_FontSize_md,
  global_FontSize_sm,
  global_FontSize_xs,
  global_FontWeight_bold,
  global_FontWeight_normal,
  global_LineHeight_md,
  global_primary_color_100,
  global_spacer_2xl,
  global_spacer_3xl,
  global_spacer_lg,
  global_spacer_md,
  global_spacer_sm,
  global_spacer_xl,
  global_spacer_xs,
  global_success_color_100,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  charge: {
    display: 'flex',
    alignItems: 'center',
  },
  chargeLabel: {},
  chargeValue: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  chargeLabelUnit: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_100.var,
  },
  chargeLabelDate: {
    fontSize: global_FontSize_sm.value,
    color: global_Color_200.var,
  },
  cpuContainer: {
    paddingLeft: global_spacer_2xl.value,
    paddingTop: global_spacer_xl.value,
  },
  content: {
    backgroundColor: global_BackgroundColor_300.var,
    paddingTop: global_spacer_xl.value,
    height: '100%',
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
  memoryContainer: {
    paddingTop: global_spacer_xl.value,
  },
  title: {
    paddingBottom: global_spacer_sm.var,
  },
  ocpDetails: {
    backgroundColor: global_BackgroundColor_300.var,
    minHeight: '100%',
  },
  groupBySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  groupBySelectorLabel: {
    marginBottom: 0,
    marginRight: global_spacer_md.var,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_300.value,
  },
  infoItemArrow: {
    position: 'relative',
  },
  descArrow: {
    bottom: global_spacer_xs.value,
  },
});

export const listViewOverride = css`
  min-height: 100%;
  padding: 0 ${global_spacer_xl.value};
  background-color: ${global_Color_light_200.value};
  ${global_Color_100.name}: ${global_Color_light_100.value};
  ${global_Color_200.name}: ${global_Color_light_200.value};

  .list-view-pf {
    margin-top: 0;
  }
  .list-group-item:hover {
    background-color: #fff;
    box-shadow: ${global_BoxShadow_sm.value};
    z-index: 1;
  }

  & * {
    // outline: 1px solid blue;
  }

  .list-group-item-heading,
  strong {
    font-weight: ${global_FontWeight_normal.value};
    word-break: break-word;
  }

  .list-group-item-heading {
    font-size: ${global_FontSize_md.value};
  }

  .list-view-pf-main-info {
    padding: 0;
  }

  .list-view-pf-actions,
  .fa-angle-right {
    margin: 0;
  }

  input[type='checkbox'] {
    margin: 0;
  }

  .list-view-pf-description {
    display: inline-flex;
    margin-left: 0;
    float: none;
  }

  .list-view-pf-additional-info {
    flex: 0 0 40%;
    float: none;
    width: auto;
  }

  .list-view-pf-actions {
    flex: 0 0 25%;
  }

  .list-group-item-header {
    display: flex;
    align-items: center;
  }

  & .list-view-pf-main-info {
    flex: 1;
  }

  .list-view-pf-checkbox {
    border: none;
    margin-top: 0;
    margin-bottom: 0;
    display: inline-flex;
    align-items: center;
  }

  .list-view-pf-expand {
    min-width: 1.5rem;
    margin-top: 0;
    margin-bottom: 0;
    display: inline-flex;
    align-items: center;
  }

  .list-view-pf-additional-info-item {
    align-items: flex-end;
    text-align: left;
    word-break: break-word;
    .fa {
      margin-right 0;
    }
  }

  .list-view-pf-actions .list-view-pf-additional-info-item {
    align-items: flex-end;
  }

  .list-view-pf-additional-info-item 
    strong {
      display: block;
      margin-right: 0;
      margin-bottom: ${global_spacer_xs.value};
      font-size: ${global_FontSize_md.value};
      &.iconOverride {
        &.decrease {
          color: ${global_success_color_100.value};
        }
        &.increase {
          color: ${global_danger_color_100.value};
        }
        .fa-sort-asc, .fa-sort-desc {
          margin-left: 10px;
        }
        .fa-sort-asc::before {
          color: ${global_danger_color_100.value};
        }
        .fa-sort-desc::before {
          color: ${global_success_color_100.value};
        }
        span {
          margin-right: -17px !important;
        }
      }
    }
  }

  .list-view-pf-additional-info-item span {
    font-size: ${global_FontSize_xs.value};
    color: ${global_disabled_color_100.value};
  }

  .list-group-item {
    padding: ${global_spacer_lg.value} ${global_spacer_xl.value};
    border-bottom: 2px solid #f2f2f2;
  }

  .list-group-item:first-child {
    border-top: 0;
    padding: 0.55rem ${global_spacer_lg.value} ${global_spacer_xs.value} 3.5rem;

    &,
    .list-group-item-heading,
    .list-view-pf-additional-info-item strong {
      font-size: ${global_FontSize_sm.value};
      font-weight: ${global_FontWeight_bold.value};
    }

    .list-view-pf-additional-info {
      transform: translateX(-0.55rem);
    }

    .list-view-pf-actions .list-view-pf-additional-info-item {
      float: right;
    }
  }

  .list-group-item-container {
    padding: ${global_spacer_lg.value} ${global_spacer_3xl.value}
      ${global_spacer_lg.value} ${global_spacer_3xl.value};
    margin: ${global_spacer_lg.value} -${global_spacer_xl.value} -${
  global_spacer_lg.value
} -${global_spacer_xl.value};
    background-image: linear-gradient(
      to right,
      ${global_primary_color_100.value},
      ${global_primary_color_100.value} 3px,
      transparent 3px
    );
  }

  .list-group-item.list-view-pf-expand-active {
    background-color: #fff;
  }

  .list-view-pf-expand-active {
    box-shadow: ${global_BoxShadow_sm.value};
    z-index: 1;
    background-image: linear-gradient(
      to right,
      ${global_primary_color_100.value},
      ${global_primary_color_100.value} 3px,
      transparent 3px
    );
  }
`;

export const toolbarOverride = css`
  margin-left: ${global_spacer_xl.value};
  margin-right: ${global_spacer_xl.value};
  background-color: ${global_Color_light_100.value};
  font-size: ${global_FontSize_xs.value};

  .pf-c-button {
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
    display: inline-flex;
    align-items: center;
  }

  .fa-download {
    color: ${global_Color_100.value};
    margin-right: ${global_spacer_sm.value};
    font-size: 1.125rem;
  }

  .toolbar-pf-actions {
    display: flex;
    padding-top: ${global_spacer_sm.value};
    padding-bottom: ${global_spacer_sm.value};
  }

  .form-group {
    border: none;
  }

  .btn {
    line-height: 28px;
  }

  .btn-link {
    color: ${global_Color_200.value};
    margin-left: ${global_spacer_sm.value};
  }

  .btn-link .fa {
    font-size: ${global_FontSize_lg.value};
    color: ${global_Color_100.value};
  }

  .pf-m-plain {
    padding: 0;
    display: flex;
    align-items: center;
  }

  .dropdown .btn {
    border-radius: ${global_BorderRadius_sm.value};
    background: transparent;
    box-shadow: none;
    border-color: #c7c7c7;
    font-size: ${global_FontSize_md.value};
    font-weight: 500;
    padding-left: ${global_spacer_sm.value};
    padding-right: ${global_spacer_sm.value};
  }

  input[type='text'] {
    border-color: #c7c7c7;
    border-radius: ${global_BorderRadius_sm.value};
  }

  /* filter results */

  .toolbar-pf-results {
    font-size: ${global_FontSize_sm.value};
    padding: ${global_spacer_sm.value} 0;
    line-heght: ${global_LineHeight_md.value};
    font-weight: ${global_FontWeight_normal.value};

    .col-sm-12 {
      display: flex;
      align-items: center;
    }

    h5 {
      font-size: ${global_FontSize_sm.value};
      font-weight: ${global_FontWeight_normal.value};
      line-height: ${global_LineHeight_md.value};
    }

    .filter-pf-active-label {
      line-height: ${global_LineHeight_md.value};
    }

    .list-inline {
      line-height: ${global_LineHeight_md.value};
    }

    .label {
      font-size: ${global_FontSize_xs.value};
      border-radius: ${global_BorderRadius_sm.value};
      display: inline-flex;
      align-items: center;
    }

    .pf-remove-button {
      display: inline-flex;
      font-weight: ${global_FontWeight_normal.value};
    }
  }
`;
