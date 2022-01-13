import axios from 'axios';

import { PagedResponse } from './api';

export interface CurrencyData {
  code?: string;
  description?: string;
  name?: string;
  symbol?: string;
}

export interface Currency extends PagedResponse<CurrencyData, CurrencyData> {}

export function fetchCurrency() {
  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Currency>(`currency/?limit=100`);
    });
  } else {
    return axios.get<Currency>(`currency/?limit=100`);
  }
}
