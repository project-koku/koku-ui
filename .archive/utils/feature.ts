export const enum FeatureType {
  currency = 'currency', // Currency support https://redhat.atlassian.net/browse/COST-1277
  // ninetyDays = 'ninetyDays', // Cost Explorer 90 days feature https://redhat.atlassian.net/browse/COST-1670
  exports = 'exports', // Async exports https://redhat.atlassian.net/browse/COST-2223
  gcpOcp = 'gcp_ocp', // GCP filtered by OpenShift https://redhat.atlassian.net/browse/COST-682
  ibm = 'ibm', // IBM https://redhat.atlassian.net/browse/COST-935
  oci = 'oci', // Oracle Cloud Infrastructure
}

// Show in-progress features for stage-beta environment only
export const isStageBeta = () => {
  const insights = (window as any).insights;
  return insights && insights.chrome.isBeta() && !insights.chrome.isProd();
};

// Helper function to track multiple code segments belonging to a specific feature
export const isFeatureVisible = (feature: FeatureType) => {
  // Show in-progress features for stage-beta only
  switch (feature) {
    case FeatureType.gcpOcp:
      return true; // Todo: Enable GCP filtered by OpenShift for all envs
    case FeatureType.currency:
    case FeatureType.exports:
    case FeatureType.ibm:
    case FeatureType.oci:
      return isStageBeta();
    default:
      return false;
  }
};
