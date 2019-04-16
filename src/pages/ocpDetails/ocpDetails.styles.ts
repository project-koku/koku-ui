import { StyleSheet } from '@patternfly/react-styles';
import {
  global_BackgroundColor_300,
  global_BackgroundColor_light_100,
  global_BorderRadius_sm,
  global_Color_100,
  global_Color_200,
  global_FontSize_lg,
  global_FontSize_md,
  global_FontSize_sm,
  global_FontSize_xs,
  global_FontWeight_normal,
  global_LineHeight_md,
  global_spacer_md,
  global_spacer_sm,
  global_spacer_xl,
} from '@patternfly/react-tokens';
import { css } from 'emotion';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: global_BackgroundColor_300.value,
    paddingTop: global_spacer_xl.value,
    height: '100%',
  },
  ocpDetails: {
    backgroundColor: global_BackgroundColor_300.value,
    minHeight: '100%',
  },
  paginationContainer: {
    backgroundColor: global_BackgroundColor_light_100.value,
    marginBottom: global_spacer_xl.value,
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
  pagination: {
    backgroundColor: global_BackgroundColor_light_100.value,
    padding: global_spacer_md.value,
  },
  toolbarContainer: {
    backgroundColor: global_BackgroundColor_300.value,
  },
  tableContainer: {
    marginLeft: global_spacer_xl.value,
    marginRight: global_spacer_xl.value,
  },
});

export const toolbarOverride = css`
  margin-left: ${global_spacer_xl.value};
  margin-right: ${global_spacer_xl.value};

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
