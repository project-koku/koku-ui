import { runRosReport as runRecommendation, runRosReports as runRecommendations } from './recommendations';
import type { RosType } from './ros';
import { RosPathsType } from './ros';

export function runRosReport(rosPathsType: RosPathsType, rosType: RosType, query: string) {
  let result;
  switch (rosPathsType) {
    case RosPathsType.recommendation:
      result = runRecommendation(rosType, query);
      break;
    case RosPathsType.recommendations:
      result = runRecommendations(rosType, query);
      break;
  }
  return result;
}
