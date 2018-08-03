import { css } from '@patternfly/react-styles';
import { StyleSheet } from '@patternfly/react-styles';
import { global_FontSize_xs, global_spacer_sm } from '@patternfly/react-tokens';
import React from 'react';

const styles = StyleSheet.create({
  trendChartTitle: {
    fontSize: global_FontSize_xs.value,
    marginBottom: global_spacer_sm.value,
  },
});

interface TrendChartTitleProps {
  children: React.ReactNode;
}

const TrendChartTitle: React.SFC<TrendChartTitleProps> = ({ children }) => (
  <div className={css(styles.trendChartTitle)}>{children}</div>
);

export { TrendChartTitle, TrendChartTitleProps };
