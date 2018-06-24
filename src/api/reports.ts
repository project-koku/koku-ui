import axios from 'axios';

export interface CostReport {
  group_by: {
    account: string[];
  };
  order_by: {
    cost: 'asc' | 'desc';
  };
  filter: {
    resolution: string;
    time_scope: number;
    resource_scope: any[];
  };
  data: {
    [date: string]: {
      [account: string]: number;
    };
  }[][];
}

export function getCostReport() {
  return axios.get<CostReport>('reports/costs/');
}
