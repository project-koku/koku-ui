import type { RootState } from '../rootReducer';
import { stateKey } from './reducer';

export const getRateTierTimeRange = (unit: string) => {
  const sep = unit.split('-');
  if (sep.length === 2) {
    return { unit: sep[0], range: sep[1] };
  }
  return { unit: null, period: null };
};

export const rateFlatter = rate => {
  return rate.rates
    .map(rt => {
      const time_range = getRateTierTimeRange(rt.metric.label_measurement_unit);
      return rt.tiered_rates.map((tier, ix) => {
        return {
          source_uuids: rate.sources.map(provider => provider.uuid),
          display: `${rt.metric.label_metric.toLowerCase()} ${rt.metric.label_measurement.toLowerCase()} rate`,
          metric_type: rt.metric.name,
          index: ix,
          value: tier.value,
          value_unit: tier.unit,
          range_value: [tier.usage.usage_start, tier.usage.usage_end],
          range_unit: time_range.unit,
          period: time_range.range,
        };
      });
    })
    .map(r => r[0]);
};

export const priceList = (state: RootState) => state[stateKey];

export const cachedRates = (state: RootState, providerUuid: string) => {
  if (priceList(state)?.rates.get(providerUuid)) {
    return priceList(state).rates.get(providerUuid);
  }
  return null;
};

export const rates = (state: RootState, providerUuid: string) => {
  const cachedData = cachedRates(state, providerUuid);
  if (cachedData) {
    return cachedData.data;
  }
  return [];
};

export const ratesPerProvider = (state: RootState, providerUuid: string) =>
  rates(state, providerUuid)
    ?.map(rateFlatter)
    .reduce((acc, rateArray) => {
      return [...acc, ...rateArray];
    }, [])
    .reduce((acc, rate) => {
      let next = { ...acc };
      rate.source_uuids.forEach(uuid => {
        const prev = acc[uuid] || [];
        next = {
          ...next,
          [uuid]: [...prev, rate],
        };
      });
      return next;
    }, {});

export const status = (state: RootState, providerUuid: string) => {
  return priceList(state).status.get(providerUuid);
};

export const error = (state: RootState, providerUuid: string) => priceList(state).error.get(providerUuid);
