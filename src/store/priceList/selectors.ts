import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const getRateTierTimeRange = (unit: string) => {
  const sep = unit.split('-');
  if (sep.length === 2) {
    return { unit: sep[0], range: sep[1] };
  }
  return { unit: null, period: null };
};

export const rateFlatter = rate => {
  return rate.tiered_rate.map((tier, ix) => {
    const time_range = getRateTierTimeRange(tier.usage.unit);
    return {
      provider_uuids: rate.provider_uuids,
      display: rate.metric.display_name,
      metric_type: rate.metric.name,
      index: ix,
      value: tier.value,
      value_unit: tier.unit,
      range_value: [tier.usage.usage_start, tier.usage.usage_end],
      range_unit: time_range.unit,
      period: time_range.range,
    };
  });
};

export const priceList = (state: RootState) => state[stateKey];

export const rates = (state: RootState) =>
  priceList(state).rates && priceList(state).rates.data;

export const ratesPerProvider = (state: RootState) =>
  rates(state) &&
  rates(state)
    .map(rateFlatter)
    .reduce((acc, rateArray) => {
      return [...acc, ...rateArray];
    }, [])
    .reduce((acc, rate) => {
      let next = { ...acc };
      rate.provider_uuids.forEach(uuid => {
        const prev = acc[uuid] || [];
        next = {
          ...next,
          [uuid]: [...prev, rate],
        };
      });
      return next;
    }, {});

export const status = (state: RootState) => priceList(state).status;

export const error = (state: RootState) => priceList(state).error;
