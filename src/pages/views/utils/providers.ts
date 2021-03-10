import { Providers } from 'api/providers';

// Ensure at least one source provider has data available for the current month
export const hasCurrentMonthData = (providers: Providers) => {
  let result = false;

  if (providers && providers.data) {
    for (const provider of providers.data) {
      if (provider.current_month_data) {
        result = true;
        break;
      }
    }
  }
  return result;
};

// Ensure at least one source provider has data available
export const hasData = (providers: Providers) => {
  let result = false;

  if (providers && providers.data) {
    for (const provider of providers.data) {
      if (provider.has_data) {
        result = true;
        break;
      }
    }
  }
  return result;
};

// Ensure at least one source provider has data available for the previous month
export const hasPreviousMonthData = (providers: Providers) => {
  let result = false;

  if (providers && providers.data) {
    for (const provider of providers.data) {
      if (provider.previous_month_data) {
        result = true;
        break;
      }
    }
  }
  return result;
};
