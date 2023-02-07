import { runRos as runRecommendation } from './recommendations';
import type { RosType } from './ros';
import { RosPathsType } from './ros';

export function runRos(rosPathsType: RosPathsType, rosType: RosType, query: string) {
  let result;
  switch (rosPathsType) {
    case RosPathsType.recommendation:
      result = runRecommendation(rosType, query);
      break;
  }
  return result;
}
