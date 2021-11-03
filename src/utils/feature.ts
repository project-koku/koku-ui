// Show in-progress features in beta environment only
export const isBetaFeature = () => {
  const insights = (window as any).insights;
  return insights && insights.chrome.isBeta() && !insights.chrome.isProd;
};
