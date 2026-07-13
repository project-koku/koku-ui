import type React from 'react';

/**
 * Read build-time / runtime Unleash flags.
 *
 * Webpack DefinePlugin replaces `process.env.ONPREM_UNLEASH_FLAGS` with a string
 * literal. Do not gate on `typeof process === 'undefined'` — that skips the
 * replaced expression in the browser and ignores custom build-time flags.
 */
const readUnleashFlagsEnv = (): string => {
  try {
    return process.env.ONPREM_UNLEASH_FLAGS ?? '';
  } catch {
    return '';
  }
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
