import type { ReactNode } from 'react';

/**
 * On-prem flag stub for this remote only.
 * `platform.integrations.hcs-disable` defaults on so DataLoader does not call console.redhat.com.
 * Every other flag stays off unless it is listed in ONPREM_UNLEASH_FLAGS.
 */
const HCS_DISABLE_FLAG = 'platform.integrations.hcs-disable';

const readEnabledFlags = (): Set<string> => {
  try {
    const raw = process.env.ONPREM_UNLEASH_FLAGS ?? '';
    return new Set(
      raw
        .split(',')
        .map(flag => flag.trim())
        .filter(Boolean)
    );
  } catch {
    return new Set();
  }
};

const isEnabled = (feature: string) => feature === HCS_DISABLE_FLAG || readEnabledFlags().has(feature);

export const useFlag = (feature: string) => isEnabled(feature);

export const useUnleashClient = () => ({
  isEnabled,
});

export const FlagProvider = ({ children }: { children: ReactNode }) => children;
