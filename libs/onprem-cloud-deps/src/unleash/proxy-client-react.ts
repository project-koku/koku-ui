import type React from 'react';

const readUnleashFlagsEnv = (): string => {
  if (typeof process === 'undefined') {
    return '';
  }
  return process.env.ONPREM_UNLEASH_FLAGS ?? '';
};

const parseEnabledFlags = (): Set<string> => {
  const raw = readUnleashFlagsEnv();
  return new Set(
    raw
      .split(',')
      .map(flag => flag.trim())
      .filter(Boolean)
  );
};

/** Lazy init avoids TDZ when this module loads early in federated HCCM chunks. */
let enabledFlags: Set<string> | undefined;

const getEnabledFlags = (): Set<string> => {
  if (!enabledFlags) {
    enabledFlags = parseEnabledFlags();
  }
  return enabledFlags;
};

/** Test-only hook to override flags without rebuilding. */
export const __setOnpremUnleashFlags = (features: string[]) => {
  enabledFlags = new Set(features);
};

export const useUnleashClient = () => ({
  isEnabled: (feature: string) => getEnabledFlags().has(feature),
});

/** POC default: flags off unless listed in `ONPREM_UNLEASH_FLAGS` (comma-separated). */
export const useFlag = (feature: string) => getEnabledFlags().has(feature);

export const FlagProvider = ({ children }: { children: React.ReactNode }) => children;
