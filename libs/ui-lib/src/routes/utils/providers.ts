import type { Providers } from '@koku-ui/api/providers';
import type { ProviderType } from '@koku-ui/api/providers';

const enum DataType {
  currentMonthData = 'current_month_data',
  hasData = 'has_data',
  previousMonthData = 'previous_month_data',
}

// Returns the OCP provider matching the given infrastructure uuid
const _getOcpProvider = (ocpProviders: Providers, uuid?: string) => {
  let result;

  if (ocpProviders?.data) {
    for (const provider of ocpProviders.data) {
      if (provider?.infrastructure?.uuid === uuid) {
        result = provider;
        break;
      }
    }
  }
  return result;
};

// Returns new Provider matching the given provider type
//
// See https://issues.redhat.com/browse/COST-2202
export const filterProviders = (providers: Providers, sourceType: ProviderType) => {
  if (!providers) {
    return providers;
  }

  const data = providers.data.filter(provider => provider.source_type.toLowerCase() === sourceType);
  const meta = {
    ...providers.meta,
    count: data.length,
  };

  return {
    ...providers,
    meta,
    data,
  } as Providers;
};

// Ensure at least one source provider has data available
const _hasData = (providers: Providers, datumType: DataType) => {
  let result = false;

  if (providers?.data) {
    for (const provider of providers.data) {
      if (provider[datumType]) {
        result = true;
        break;
      }
    }
  }
  return result;
};

// Ensure at least one cloud source provider has data available
const _hasCloudData = (providers: Providers, ocpProviders: Providers, dataType: DataType) => {
  let result = false;

  if (providers?.data) {
    for (const provider of providers.data) {
      const ocpProvider = _getOcpProvider(ocpProviders, provider.uuid);

      // Ensure AWS provider is filtered by OpenShift and has OCP data
      if (ocpProvider && ocpProvider[dataType]) {
        result = true;
        break;
      }
    }
  }
  return result;
};

// Ensure at least one cloud source provider
const _hasCloudProvider = (providers: Providers, ocpProviders: Providers) => {
  let result = false;

  if (providers?.data) {
    for (const provider of providers.data) {
      const ocpProvider = _getOcpProvider(ocpProviders, provider.uuid);

      // Ensure AWS provider is filtered by OpenShift
      if (ocpProvider) {
        result = true;
        break;
      }
    }
  }
  return result;
};

// Ensure at least one cloud source provider has data available for the current month (e.g., "AWS filtered by OpenShift")
export const hasCloudCurrentMonthData = (providers: Providers, ocpProviders: Providers) => {
  return _hasCloudData(providers, ocpProviders, DataType.currentMonthData);
};

// Ensure at least one cloud source provider has data available (e.g., "AWS filtered by OpenShift")
export const hasCloudData = (providers: Providers, ocpProviders: Providers) => {
  return _hasCloudData(providers, ocpProviders, DataType.hasData);
};

// Ensure at least one cloud source provider has data available for the previous month (e.g., "AWS filtered by OpenShift")
export const hasCloudPreviousMonthData = (providers: Providers, ocpProviders: Providers) => {
  return _hasCloudData(providers, ocpProviders, DataType.previousMonthData);
};

// Ensure at least one cloud source provider (e.g., "AWS filtered by OpenShift"), regardless if there is OCP data
export const hasCloudProvider = (providers: Providers, ocpProviders: Providers) => {
  return _hasCloudProvider(providers, ocpProviders);
};

// Ensure at least one source provider has data available for the current month
export const hasCurrentMonthData = (providers: Providers) => {
  return _hasData(providers, DataType.currentMonthData);
};

// Ensure at least one source provider has data available
export const hasData = (providers: Providers) => {
  return _hasData(providers, DataType.hasData);
};

// Ensure at least one source provider has data available for the previous month
export const hasPreviousMonthData = (providers: Providers) => {
  return _hasData(providers, DataType.previousMonthData);
};
