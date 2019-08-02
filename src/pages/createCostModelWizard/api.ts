import { fetchCostModels } from 'api/costModels';
import { fetchProviders } from 'api/providers';

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
      return fetchCostModels().then(cms => ({
        costmodels: cms.data.data,
        sources,
      }));
    })
    .then(({ costmodels, sources }) => {
      const cmsHash = costmodels.reduce((acc, curr) => {
        curr.provider_uuids.forEach(provider_uuid => {
          acc[provider_uuid] = curr.name;
        });
        return acc;
      }, {});
      return sources.map(src => ({
        name: src.name,
        costmodel: cmsHash[src.uuid],
        uuid: src.uuid,
        selected: false,
      }));
    });
};
