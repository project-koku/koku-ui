/** Feature toggles shared with useFeatureToggle and webpack-onprem.config.ts. */
export const enum FeatureToggleType {
  boxPlot = 'cost-management.koku-ui-ros.box-plot', // https://redhat.atlassian.net/browse/COST-4619
  debug = 'cost-management.koku-ui-ros.debug', // Logs user data (e.g., account ID) in browser console
  namespace = 'cost-management.koku-ui-ros.namespace', // Namespace recommendations https://redhat.atlassian.net/browse/COST-6267
  projectLink = 'cost-management.koku-ui-ros.project-link', // Optimizations breakdown project link https://redhat.atlassian.net/browse/COST-4527
}
