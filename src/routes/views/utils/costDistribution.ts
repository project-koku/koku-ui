import { getCostDistribution as getCostDistributionFromLocaleStorage } from 'utils/localStorage';

// eslint-disable-next-line no-shadow
export const enum CostDistributionType {
  distributed = 'distributed',
  total = 'total',
}

// Returns cost type
export const getCostType = () => {
  switch (getCostDistributionFromLocaleStorage()) {
    case 'distributed':
      return CostDistributionType.distributed;
    case 'total':
    default:
      return CostDistributionType.total;
  }
};
