import { runRosReport as runRecommendation } from './recommendations';
import type { RosType } from './ros';
import { RosPathsType } from './ros';

export function runRosReport(rosPathsType: RosPathsType, rosType: RosType, query: string) {
  let result;
  switch (rosPathsType) {
    case RosPathsType.recommendation:
    case RosPathsType.recommendationList:
      result = runRecommendation(rosType, query);
      break;
  }
  return result;
}
