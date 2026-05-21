import type { CostModelProvider } from 'api/costModels';

// Filter sources by name
export const getFilteredSources = (sources: CostModelProvider[], filterBy: any): CostModelProvider[] => {
  if (!sources) {
    return [];
  }
  const nameFilters = filterBy?.name || [];
  if (nameFilters.length === 0) {
    return sources;
  }
  return sources.filter(source => {
    return (
      nameFilters.length === 0 || nameFilters.some(item => source?.name?.toLowerCase()?.includes(item.toLowerCase()))
    );
  });
};

// Paginated sources for table
export const getPaginatedSources = (
  sources: CostModelProvider[],
  pageNumber: number,
  perPage: number
): CostModelProvider[] => {
  const offset = pageNumber * perPage - perPage;
  const end = Math.min(offset + perPage, sources?.length ?? 0);
  return sources?.slice(offset, end) ?? [];
};
