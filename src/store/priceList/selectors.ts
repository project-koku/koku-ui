import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const priceList = (state: RootState) => state[stateKey];

export const rates = (state: RootState) =>
  priceList(state).rates && priceList(state).rates.data;

export const ratesPerProvider = (state: RootState) =>
  rates(state) &&
  rates(state).reduce(
    (acc, rate) => ({
      ...acc,
      [rate.provider_uuid]: {
        ...acc[rate.provider_uuid],
        [rate.metric]: rate.tiered_rate[0],
      },
    }),
    {}
  );

export const status = (state: RootState) => priceList(state).status;

export const error = (state: RootState) => priceList(state).error;

export const isModalOpen = (state: RootState) => priceList(state).modal.isOpen;

export const modalName = (state: RootState) => priceList(state).modal.name;
