/* eslint-disable @typescript-eslint/no-unused-vars */
import { MetricHash } from 'api/metrics';
import React from 'react';

export const defaultCostModelContext = {
  metricsHash: {} as MetricHash,
  step: 1,
  type: '',
  name: '',
  markup: '',
  description: '',
  error: null,
  apiError: null,
  sources: [],
  onTypeChange: (value: string) => null,
  onNameChange: (value: string) => null,
  onDescChange: (value: string) => null,
  onMarkupChange: (value: string) => null,
  onSourceSelect: (...args: any[]) => null,
  setSources: (value: any) => null,
  dataFetched: false,
  loading: false,
  filterName: '',
  onFilterChange: (value: string) => null,
  query: {},
  clearQuery: () => null,
  total: 0,
  page: 1,
  perPage: 10,
  onPageChange: (_evt, value: number) => null,
  onPerPageChange: (_evt, value: number) => null,

  tiers: [],
  goToAddPL: (value?: boolean) => null,
  submitTiers: (tiers: any) => null,
  priceListPagination: {
    page: 1,
    perPage: 4,
    onPerPageSet: (_evt, perPage: number) => null,
    onPageSet: (_evt, page: number) => null,
  },
  fetchSources: (type: string, query: any, page: number, perPage: number) => null,

  createError: null,
  createSuccess: false,
  onClose: () => null,
  createProcess: false,
};

export const CostModelContext = React.createContext(defaultCostModelContext);
