// Normalize status / source_type strings for message keys and lookups.
// Strips the local-dev "-local" suffix (AWS-local → aws) so message keys match.
export const normalize = (value: string) => {
  if (!value) {
    return undefined;
  }
  const lower = value.toLowerCase();
  const withoutLocal = lower.endsWith('-local') ? lower.slice(0, -'-local'.length) : lower;
  return withoutLocal.replace(/-/g, '_');
};
