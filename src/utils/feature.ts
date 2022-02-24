// eslint-disable-next-line no-shadow
export const enum FeatureType {
  currency = 'currency', // Currency support
  exports = 'exports', // Async exports
  gcpOcp = 'gcp_ocp', // GCP filtered by OpenShift
  ibm = 'ibm', // IBM
  oci = 'oci', // Open Container Initiative
}

// Show in-progress features for stage-beta environment only
export const isStageBeta = () => {
  const insights = (window as any).insights;
  return insights && insights.chrome.isBeta() && !insights.chrome.isProd;
};

// Helper function to track multiple code segments belonging to a specific feature
export const isFeatureVisible = (feature: FeatureType) => {
  switch (feature) {
    case FeatureType.currency:
    case FeatureType.exports:
    case FeatureType.ibm:
    case FeatureType.oci:
      return isStageBeta();
    default:
      return false;
  }
};
