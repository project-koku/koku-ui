import 'routes/components/charts/common/chart.scss';

import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLabel,
  ChartLine,
  ChartThemeColor,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts/victory';
import { Button, ButtonVariant, Card, CardBody, CardTitle, Split, SplitItem } from '@patternfly/react-core';
import t_chart_color_black_500 from '@patternfly/react-tokens/dist/esm/t_chart_color_black_500';
import type { PriceListData } from 'api/priceList';
import { startOfMonth } from 'date-fns';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { getResizeObserver } from 'routes/components/charts/common/chartUtils';
import { NoSelectionsState } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/state';
import { useFetchPriceLists } from 'routes/settings/costModels/costModelBreakdown/priceLists/utils';
import { getEffectiveDate, getEffectiveStartDate } from 'routes/settings/priceLists/priceList/components/details/utils';

import { styles } from './timelineChart.styles';

interface TimelineChartOwnProps {
  isReset?: boolean;
  onResetClick?: () => void;
  priceLists: PriceListDataExt[];
}

interface PriceListDataExt extends PriceListData {
  priority?: number;
}

type TimelineChartProps = TimelineChartOwnProps;

const TimelineChart: React.FC<TimelineChartProps> = ({ isReset, onResetClick, priceLists }) => {
  const intl = useIntl();

  // Workaround for the cost models API's missing price list properties
  const { priceList: fullPriceList } = useFetchPriceLists();

  // eslint-disable-next-line react-hooks/refs
  const [containerRef] = useState(React.createRef<HTMLDivElement>());
  const height = 200 + Math.max(0, (priceLists?.length ?? 0) - 1) * 25;
  const [width, setWidth] = useState(0);

  const priceListDatum = priceLists?.map((item, index) => {
    const fullPriceListItem = fullPriceList?.data?.find(p => p.uuid === item.uuid);
    const effectiveEndDate = item?.effective_end_date
      ? new Date(`${item.effective_end_date}T00:00:00`)
      : getEffectiveDate(fullPriceListItem?.effective_end_date);
    const effectiveStartDate = item?.effective_start_date
      ? new Date(`${item.effective_start_date}T00:00:00`)
      : getEffectiveDate(fullPriceListItem?.effective_start_date);

    // Effective dates must start on the first day of the month for tick labels to align correctly
    const startDate = getEffectiveStartDate(effectiveStartDate);
    const endDate = getEffectiveStartDate(effectiveEndDate);
    endDate?.setMonth(endDate?.getMonth() + 1);

    return {
      effectiveEndDate, // Save for tooltip
      effectiveStartDate, // Save for tooltip
      name: item?.name ?? '',
      priority: item?.priority ?? undefined,
      x: `${priceLists.length - index} ${item.name ?? ''}`,
      y0: startDate,
      y: endDate,
    };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const chartDatum =
    priceListDatum.length > 0
      ? [
          {
            name: 'dummy-padding-top',
            x: 'dummy-padding-top',
            y: today,
            y0: today,
          },
          ...priceListDatum,
          {
            name: 'dummy-padding-bottom',
            x: 'dummy-padding-bottom',
            y: today,
            y0: today,
          },
        ]
      : [];

  // Span categories for a vertical "today" line.
  const todayLineData = [
    { x: chartDatum[0]?.x, y: today },
    { x: chartDatum[chartDatum.length - 1]?.x, y: today },
  ];

  const maxDate = new Date(Math.max(today.getTime(), ...chartDatum.map(item => item.y?.getTime() ?? 0)));
  const minDate = new Date(Math.min(today.getTime(), ...chartDatum.map(item => item.y0?.getTime() ?? 0)));

  const activePriceList = priceListDatum
    ?.sort((a, b) => a.priority - b.priority)
    ?.find(datum => {
      if (today >= datum.y0 && today < datum.y) {
        return datum;
      }
    });

  // Getters

  const getActiveFill = (name: string) => {
    return activePriceList?.name === name ? styles.active.color : styles.inactive.color;
  };

  const getChart = () => {
    return (
      <Chart
        ariaDesc={intl.formatMessage(messages.priceListTimeline)}
        containerComponent={
          <ChartVoronoiContainer
            voronoiBlacklist={['dummy-padding-top', 'dummy-padding-bottom', 'today']}
            labelComponent={
              <ChartTooltip
                constrainToVisibleArea
                dx={({ x, x0 }: any) => -(x - x0) / 2} // Position tooltip so pointer appears centered
                dy={-10} // Position tooltip so pointer appears above bar
                labelComponent={<ChartLabel dx={-72} textAnchor="start" />}
                orientation="top" // Mimic bullet chart tooltip orientation
                pointerOrientation="bottom"
              />
            }
            labels={({ datum }) =>
              intl.formatMessage(messages.priceListTimelineStartDate, {
                startDate: getFormattedDate(datum.effectiveStartDate),
              }) +
              '\n' +
              intl.formatMessage(messages.priceListTimelineEndDate, {
                endDate: getFormattedDate(datum.effectiveEndDate),
              })
            }
          />
        }
        // domainPadding={{ x: [20, 20] }}
        height={height}
        name="chart3"
        padding={{
          bottom: 75, // Adjusted to accommodate legend
          left: 175,
          right: 50, // Adjusted to accommodate tick labels
          top: 50,
        }}
        themeColor={ChartThemeColor.gray}
        width={width}
      >
        <ChartAxis
          tickFormat={t => {
            if (t.includes('dummy')) {
              return '';
            }
            return t?.length > 20 ? t?.slice(0, 20) + '...' : t;
          }}
        />
        <ChartAxis
          dependentAxis
          fixLabelOverlap
          showGrid
          tickFormat={t => {
            return typeof t === 'string'
              ? t
              : intl.formatDate(new Date(t), {
                  month: 'short',
                  year: 'numeric',
                });
          }}
          tickValues={getMonthlyTickValues()}
        />
        <ChartGroup horizontal>
          {chartDatum?.map((datum, index) => (
            <ChartBar
              barWidth={18}
              data={[datum]}
              key={`chart-bar-${index}`}
              name={datum.name}
              style={{ data: { fill: getActiveFill(datum.name) } }}
            />
          ))}
        </ChartGroup>
        <ChartLine
          data={todayLineData}
          horizontal
          name="today"
          style={{
            data: {
              stroke: t_chart_color_black_500.var,
              strokeWidth: 2,
            },
          }}
        />
      </Chart>
    );
  };

  const getFormattedDate = (date: Date) => {
    return intl.formatDate(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get monthly tick values
  const getMonthlyTickValues = () => {
    const result = [];

    for (let date = startOfMonth(minDate); date <= maxDate; date.setMonth(date.getMonth() + 1)) {
      result.push(new Date(date));
    }
    return result;
  };

  // Handlers

  const handleOnResize = () => {
    const { clientWidth = 0 } = containerRef?.current || {};
    if (clientWidth !== width) {
      setWidth(clientWidth);
    }
  };

  // Effects

  useEffect(() => {
    if (containerRef?.current) {
      const unobserve = getResizeObserver(containerRef?.current, handleOnResize);
      return () => {
        if (unobserve) {
          unobserve();
        }
      };
    }
  }, [containerRef, handleOnResize]);

  return (
    <Card style={styles.card}>
      <CardTitle>
        {isReset ? (
          <Split>
            <SplitItem isFilled>{intl.formatMessage(messages.priceListTimeline)}</SplitItem>
            <SplitItem>
              <Button onClick={onResetClick} variant={ButtonVariant.link}>
                {intl.formatMessage(messages.reset)}
              </Button>
            </SplitItem>
          </Split>
        ) : (
          <>{intl.formatMessage(messages.priceListTimeline)}</>
        )}
      </CardTitle>
      <CardBody>
        {chartDatum?.length > 0 ? (
          <>
            <div className="chartOverride" ref={containerRef}>
              <div style={{ height: `${height}px` }}>{getChart()}</div>
            </div>
          </>
        ) : (
          <NoSelectionsState />
        )}
      </CardBody>
    </Card>
  );
};

export { TimelineChart };
