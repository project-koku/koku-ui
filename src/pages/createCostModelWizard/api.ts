import { fetchProviders } from 'api/costModelsProviders';

export const fetchSources = ({ type, page, perPage, query }) => {
  const offset = (page - 1) * perPage;
  const limit = perPage;
  const queryParam = Object.keys(query).reduce(
    (acc, cur) =>
      acc ? `${acc}&${cur}=${query[cur]}` : `${cur}=${query[cur]}`,
    ''
  );
  return fetchProviders(
    `type=${type}&limit=${limit}&offset=${offset}&${queryParam}`
  )
    .then(sources => sources.data.data)
    .then(sources => {
      return sources.map(src => ({
        name: src.name,
        uuid: src.uuid,
        costmodel: src.cost_models.map(cm => cm.name).join(','),
        selected: false,
      }));
    });
};
