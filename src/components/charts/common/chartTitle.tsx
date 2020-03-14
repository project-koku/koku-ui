import { css } from '@patternfly/react-styles';
import { StyleSheet } from '@patternfly/react-styles';
import { global_FontSize_xs, global_spacer_sm } from '@patternfly/react-tokens';
import React from 'react';

const styles = StyleSheet.create({
  chartTitle: {
    fontSize: global_FontSize_xs.value,
    marginBottom: global_spacer_sm.value,
  },
});

interface ChartTitleProps {
  children: React.ReactNode;
}

const ChartTitle: React.SFC<ChartTitleProps> = ({ children }) => (
  <div className={css(styles.chartTitle)}>{children}</div>
);

export { ChartTitle, ChartTitleProps };
