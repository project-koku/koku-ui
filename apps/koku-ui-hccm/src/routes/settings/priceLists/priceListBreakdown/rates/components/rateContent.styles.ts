import t_global_font_weight_body_bold_legacy from '@patternfly/react-tokens/dist/js/t_global_font_weight_body_bold_legacy';
import type React from 'react';

export const styles = {
  currency: {
    fontWeight: t_global_font_weight_body_bold_legacy.value as any,
  },
  modal: {
    minWidth: '1200px',
  },
  splitItem: {
    minWidth: '200px',
  },
  /** Vertically center columns in the row (switch lines up with metric/rate fields, not pinned to the bottom) */
  splitRowAlignFields: {
    alignItems: 'center',
  },
  /**
   * Last column: allow shrinking in the flex row so tag-key input stays in view
   * (avoids overflow when switch + text field share the cell with other wide columns)
   */
  splitItemTagKeyColumn: {
    flex: '1 1 250px',
    maxWidth: '100%',
    minWidth: 0,
  },
  /** Switch only — natural width; do not use splitItem (210px) or it crowds out the text input */
  splitItemSwitchOnly: {
    flex: '0 0 auto',
  },
  /** Tag key field grows within the cell; minWidth 0 lets flex shrink before clipping */
  splitItemTagKeyInput: {
    flex: '1 1 0%',
    minWidth: 0,
  },
  /** Inner split uses full width of the tag-rate column */
  splitSwitchAndTagKey: {
    alignItems: 'center',
    minWidth: 0,
    width: '100%',
  },
  tagKeyTextInput: {
    maxWidth: '100%',
    minWidth: 0,
    width: '100%',
  },
} as { [className: string]: React.CSSProperties };
