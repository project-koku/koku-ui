import type React from 'react';

// Split for Jest, which will deoptimise styling if files exceed its max size
import { styles as item1Styles } from './emptyStates/item1.styles';
import { styles as item2Styles } from './emptyStates/item2.styles';
import { styles as item3Styles } from './emptyStates/item3.styles';
import { styles as item4Styles } from './emptyStates/item4.styles';
import { styles as item5Styles } from './emptyStates/item5.styles';
import { styles as item6Styles } from './emptyStates/item6.styles';

export const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  containerMargin: {
    marginTop: '150px',
  },
  item1: item1Styles.item,
  item2: item2Styles.item,
  item3: item3Styles.item,
  item4: item4Styles.item,
  item5: item5Styles.item,
  item6: item6Styles.item,
  scrollContainer: {
    height: '200px',
  },
} as { [className: string]: React.CSSProperties };
