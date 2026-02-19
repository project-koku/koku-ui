import 'routes/components/charts/common/chart.scss';

import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartBoxPlot,
  ChartLegend,
  ChartLegendTooltip,
  ChartScatter,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts/victory';
import messages from 'locales/messages';
import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { getDateRangeString } from 'routes/components/charts/common';
import type { ChartSeries } from 'routes/components/charts/common/chartUtils';
import {
  getDomain,
  getLegendData,
  getResizeObserver,
  initHiddenSeries,
  isDataAvailable,
  isSeriesHidden,
} from 'routes/components/charts/common/chartUtils';
import ChartTheme from 'routes/components/charts/theme';
import { unitsLookupKey } from 'utils/format';

import { chartStyles } from './optimizationsBreakdownChart.styles';

interface OptimizationsBreakdownChartOwnProps {
  baseHeight?: number;
  limitData?: any;
  name?: string;
  padding?: any;
  requestData?: any;
  usageData?: any;
}

type OptimizationsBreakdownChartProps = OptimizationsBreakdownChartOwnProps;

const OptimizationsBreakdownChart: React.FC<OptimizationsBreakdownChartProps> = ({
  baseHeight,
  name,
  limitData,
  padding,
  requestData,
  usageData,
}) => {
  // eslint-disable-next-line
  const [containerRef] = useState(React.createRef<HTMLDivElement>());
  const [cursorVoronoiContainer, setCursorVoronoiContainer] = useState<any>();
  const [extraHeight, setExtraHeight] = useState(0);
  const [hiddenSeries, setHiddenSeries] = useState(new Set<number>());
  const [series, setSeries] = useState<ChartSeries[]>();
  const [width, setWidth] = useState(0);
  const intl = useIntl();

  // Clone original container. See https://issues.redhat.com/browse/COST-762
  const cloneContainer = () => {
    const legendData = getLegendData(series, hiddenSeries, true);
    // Force extra space for line wrapping
    legendData?.push(
      {
        childName: 'usage',
        name: '',
        symbol: {
          fill: 'none',
        },
      },
      {
        childName: 'usage',
        name: '',
        symbol: {
          fill: 'none',
        },
      }
    );
    return cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: <ChartLegendTooltip legendData={legendData} title={datum => datum.x} />,
        } as any)
      : undefined;
  };

  const getLimitChart = () => {
    return series?.map((serie, index) => {
      if (serie.childName === 'limit') {
        return (
          <ChartArea
            data={!hiddenSeries.has(index) ? serie.data : [{ y: null }]}
            interpolation="monotoneX"
            key={serie.childName}
            name={serie.childName}
            style={serie.style}
          />
        );
      }
    });
  };

  const getRequestChart = () => {
    return series?.map((serie, index) => {
      if (serie.childName === 'request') {
        return (
          <ChartArea
            data={!hiddenSeries.has(index) ? serie.data : [{ y: null }]}
            interpolation="monotoneX"
            key={serie.childName}
            name={serie.childName}
            style={serie.style}
          />
        );
      }
    });
  };

  const getScatterChart = () => {
    return series?.map((serie, index) => {
      if (serie.childName === 'scatter') {
        return (
          <ChartScatter
            data={!hiddenSeries.has(index - 1) ? serie.data : [{ y: null }]}
            key={serie.childName}
            name={serie.childName}
            style={serie.style}
          />
        );
      }
    });
  };

  const getUsageChart = () => {
    return series?.map((serie, index) => {
      if (serie.childName === 'usage') {
        return (
          <ChartBoxPlot
            boxWidth={width < 475 ? 15 : undefined}
            data={!hiddenSeries.has(index) ? serie.data : [{ y: [null] }]}
            key={serie.childName}
            name={serie.childName}
            style={serie.style}
          />
        );
      }
    });
  };

  // Returns groups of chart names associated with each data series
  const getChartNames = () => {
    const result = [];

    if (series) {
      series.map(serie => {
        // Each group of chart names are hidden / shown together
        if (serie.childName === 'usage') {
          result.push([serie.childName, 'scatter']);
        } else if (serie.childName !== 'scatter') {
          result.push(serie.childName);
        }
      });
    }
    return result as any;
  };

  // Returns CursorVoronoiContainer component
  const getCursorVoronoiContainer = () => {
    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    const labelFormatter = datum => {
      const formatValue = val => (val !== undefined ? val : '');
      let units = datum.units;

      /**
       * The recommendations API intentionally omits CPU request and limit units when "cores".
       *
       * The yaml format for the resource units needs to adhere to the Kubernetes standard that is outlined here
       * https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
       *
       * Example. "45 millicores" is represented as "45m", 64 MiB is represented as "64Mi",
       * 2.3 cores is represented as "2.3" (Note cores is not specified)
       */
      if (
        (datum.childName === 'limit' || datum.childName === 'request' || datum.childName === 'usage') &&
        datum.units === ''
      ) {
        units = unitsLookupKey('cores');
      }

      if (datum.childName === 'scatter') {
        return null;
      } else if (
        datum.childName === 'usage' &&
        (datum._min !== undefined ||
          datum._max !== undefined ||
          datum._median !== undefined ||
          datum._q1 !== undefined ||
          datum._q3 !== undefined ||
          datum.yVal !== null)
      ) {
        return intl.formatMessage(messages.chartUsageTooltip, {
          br: '\n',
          min: formatValue(datum._min !== undefined ? datum._min : datum.yVal),
          max: formatValue(datum._max !== undefined ? datum._max : datum.yVal),
          median: formatValue(datum._median !== undefined ? datum._median : datum.yVal),
          q1: formatValue(datum._q1 !== undefined ? datum._q1 : datum.yVal),
          q3: formatValue(datum._q3 !== undefined ? datum._q3 : datum.yVal),
          units: intl.formatMessage(messages.units, { units: unitsLookupKey(units) }),
        });
      }

      // With box plot, datum.y will be an array
      const yVal = Array.isArray(datum.y) ? datum.y[0] : datum.y;

      return yVal !== null
        ? intl.formatMessage(messages.valueUnits, {
            value: yVal,
            units: intl.formatMessage(messages.units, { units: unitsLookupKey(units) }),
          })
        : intl.formatMessage(messages.chartNoData);
    };

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={({ datum }) => labelFormatter(datum)}
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={getPadding()}
      />
    );
  };

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  const getEvents = () => {
    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: `${name}-legend`,
      onLegendClick: props => handleOnLegendClick(props.index),
    });
    return result;
  };

  const getHeight = () => {
    return baseHeight + extraHeight;
  };

  const getLegend = () => {
    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        name={`${name}-legend`}
        responsive={false}
      />
    );
  };

  const getPadding = () => {
    return padding
      ? padding
      : {
          bottom: 75 + extraHeight, // Maintain chart aspect ratio
          left: 50,
          right: 50,
          top: 10,
        };
  };

  const handleLegendAllowWrap = value => {
    if (value !== extraHeight) {
      setExtraHeight(value);
    }
  };

  // Hide each data series individually
  const handleOnLegendClick = (index: number) => {
    const newHiddenSeries = initHiddenSeries(series, hiddenSeries, index);
    setHiddenSeries(newHiddenSeries);
  };

  const handleOnResize = () => {
    const { clientWidth = 0 } = containerRef?.current || {};

    if (clientWidth !== width) {
      setWidth(clientWidth);
    }
  };

  const initDatum = () => {
    // Show all legends, regardless of data size

    const newSeries: ChartSeries[] = [];
    if (requestData && requestData.length) {
      newSeries.push({
        childName: 'request',
        data: requestData,
        legendItem: {
          name: getDateRangeString(requestData, messages.recommendedRequest, true),
          symbol: {
            fill: chartStyles.requestColorScale[0],
            type: 'square',
          },
          tooltip: intl.formatMessage(messages.request),
        },
        style: {
          data: {
            ...chartStyles.request,
            stroke: chartStyles.requestColorScale[0],
          },
        },
      });
    }
    if (limitData && limitData.length) {
      newSeries.push({
        childName: 'limit',
        data: limitData,
        legendItem: {
          name: getDateRangeString(limitData, messages.recommendedLimit, true),
          symbol: {
            fill: chartStyles.limitColorScale[0],
            type: 'square',
          },
          tooltip: intl.formatMessage(messages.limit),
        },
        style: {
          data: {
            ...chartStyles.limit,
            stroke: chartStyles.limitColorScale[0],
          },
        },
      });
    }
    if (usageData && usageData.length) {
      const boxPlotData = [];
      usageData.map((datum: any) => {
        if (datum.y.every((val, i, arr) => val === arr[0])) {
          boxPlotData.push({
            ...datum,
            yVal: datum.y[0],
            y: [null],
          });
        } else {
          boxPlotData.push(datum);
        }
      });
      newSeries.push({
        childName: 'usage',
        data: boxPlotData as any,
        legendItem: {
          name: getDateRangeString(limitData, messages.actualUsage),
          symbol: {
            fill: chartStyles.usageColorScale[1],
            type: 'square',
          },
          tooltip: intl.formatMessage(messages.usage),
        },
        style: {
          median: {
            stroke: chartStyles.usageColorScale[0],
          },
          q1: {
            fill: chartStyles.usageColorScale[1],
          },
          q3: {
            fill: chartStyles.usageColorScale[1],
          },
        } as any,
      });

      // Show dots in place of box plot when all values are equal
      const scatterData = [];
      usageData.map((datum: any) => {
        if (datum.y.every((val, i, arr) => val === arr[0])) {
          scatterData.push({
            ...datum,
            y: datum.y[0],
          });
        } else {
          scatterData.push({
            ...datum,
            y: null,
          });
        }
      });
      newSeries.push({
        childName: 'scatter',
        data: scatterData as any,
        style: {
          data: { fill: chartStyles.usageColorScale[1] },
        } as any,
      });
    }
    setSeries(newSeries);
    setCursorVoronoiContainer(getCursorVoronoiContainer());
    setHiddenSeries(new Set());
  };

  useMemo(() => {
    initDatum();
  }, [limitData, requestData, usageData]);

  useEffect(() => {
    if (containerRef?.current) {
      const unobserve = getResizeObserver(containerRef?.current, handleOnResize);
      return () => {
        if (unobserve) {
          unobserve();
        }
      };
    }
  }, [containerRef]);

  const chartHeight = getHeight();

  return (
    <div className="chartOverride" ref={containerRef}>
      <div style={{ height: chartHeight }}>
        <Chart
          containerComponent={cloneContainer()}
          domain={getDomain(series, hiddenSeries, 1)}
          domainPadding={{ x: [30, 30] }}
          events={getEvents()}
          height={chartHeight}
          legendAllowWrap={handleLegendAllowWrap}
          legendComponent={getLegend()}
          legendPosition="bottom"
          name={name}
          padding={getPadding()}
          theme={ChartTheme}
          width={width}
        >
          <ChartAxis fixLabelOverlap />
          <ChartAxis dependentAxis showGrid />
          {getRequestChart()}
          {getLimitChart()}
          {getScatterChart()}
          {getUsageChart()}
        </Chart>
      </div>
    </div>
  );
};

export { OptimizationsBreakdownChart };
