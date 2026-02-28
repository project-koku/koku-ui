import type { Recommendations } from 'api/ros/recommendations';

export const fullRecommendations: Recommendations = {
  current: {
    limits: { cpu: { amount: 1, format: 'cores' }, memory: { amount: 1024, format: 'MiB' } },
    requests: { cpu: { amount: 0.5, format: 'cores' }, memory: { amount: 512, format: 'MiB' } },
  },
  monitoring_end_time: '2026-02-26T00:00:00Z',
  recommendation_terms: {
    short_term: {
      duration_in_hours: 24,
      monitoring_start_time: '2026-02-25T00:00:00Z',
      recommendation_engines: {
        cost: {
          config: {
            limits: { cpu: { amount: 0.5, format: 'cores' }, memory: { amount: 512, format: 'MiB' } },
            requests: { cpu: { amount: 0.25, format: 'cores' }, memory: { amount: 256, format: 'MiB' } },
          },
          variation: {
            limits: { cpu: { amount: -50, format: 'percent' }, memory: { amount: -50, format: 'percent' } },
            requests: { cpu: { amount: -50, format: 'percent' }, memory: { amount: -50, format: 'percent' } },
          },
        },
        performance: {
          config: {
            limits: { cpu: { amount: 1.5, format: 'cores' }, memory: { amount: 1536, format: 'MiB' } },
            requests: { cpu: { amount: 0.75, format: 'cores' }, memory: { amount: 768, format: 'MiB' } },
          },
          variation: {
            limits: { cpu: { amount: 50, format: 'percent' }, memory: { amount: 50, format: 'percent' } },
            requests: { cpu: { amount: 50, format: 'percent' }, memory: { amount: 50, format: 'percent' } },
          },
        },
      },
    },
  },
};

export const costOnlyRecommendations: Recommendations = {
  ...fullRecommendations,
  recommendation_terms: {
    short_term: {
      ...fullRecommendations.recommendation_terms!.short_term,
      recommendation_engines: {
        cost: fullRecommendations.recommendation_terms!.short_term!.recommendation_engines!.cost,
      } as any,
    },
  },
};
