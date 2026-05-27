import type { PriceListData } from 'api/priceList';

// Filter price lists by name
export const getFilteredPriceLists = (pricelists: PriceListData[], filterBy: any): PriceListData[] => {
  if (!pricelists) {
    return [];
  }

  const nameFilters = filterBy?.name || [];

  if (nameFilters.length === 0) {
    return pricelists;
  }

  return pricelists.filter(priceList => {
    return (
      nameFilters.length === 0 || nameFilters.some(item => priceList?.name?.toLowerCase()?.includes(item.toLowerCase()))
    );
  });
};

// Paginated price lists for table
export const getPaginatedPriceLists = (
  pricelists: PriceListData[],
  pageNumber: number,
  perPage: number
): PriceListData[] => {
  const offset = pageNumber * perPage - perPage;
  const end = Math.min(offset + perPage, pricelists?.length ?? 0);
  return pricelists?.slice(offset, end) ?? [];
};
