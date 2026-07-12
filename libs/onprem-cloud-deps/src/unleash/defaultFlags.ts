/**
 * On-prem builds have no live Unleash proxy. Flags listed here are enabled by
 * default when `ONPREM_UNLEASH_FLAGS` is unset/empty (webpack DefinePlugin + stub).
 *
 * Expand carefully after confirming each flag is always-on in SaaS prod.
 * See COST-7658.
 */
export const BOX_PLOT_FLAG = 'cost-management.koku-ui-ros.box-plot';

/** Comma-separated Unleash flag names enabled on-prem by default. */
export const DEFAULT_ONPREM_UNLEASH_FLAGS = BOX_PLOT_FLAG;

/**
 * Resolve the on-prem Unleash flag list from an env value.
 * Empty/unset → defaults; non-empty → caller-provided override (as-is).
 */
export const resolveOnpremUnleashFlags = (raw: string | undefined): string => {
  const trimmed = (raw ?? '').trim();
  return trimmed.length > 0 ? trimmed : DEFAULT_ONPREM_UNLEASH_FLAGS;
};
