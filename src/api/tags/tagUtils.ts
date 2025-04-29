import { runTag as runAwsOcpTag } from './awsOcpTags';
import { runTag as runAwsTag } from './awsTags';
import { runTag as runAzureOcpTag } from './azureOcpTags';
import { runTag as runAzureTag } from './azureTags';
import { runTag as runGcpOcpTag } from './gcpOcpTags';
import { runTag as runGcpTag } from './gcpTags';
import { runTag as runIbmTag } from './ibmTags';
import { runTag as runOcpCloudTag } from './ocpCloudTags';
import { runTag as runOcpTag } from './ocpTags';
import { runTag as runRhelTag } from './rhelTags';
import type { TagType } from './tag';
import { TagPathsType } from './tag';

export function runTag(tagPathsType: TagPathsType, tagType: TagType, query: string) {
  let result;
  switch (tagPathsType) {
    case TagPathsType.aws:
      result = runAwsTag(tagType, query);
      break;
    case TagPathsType.awsOcp:
      result = runAwsOcpTag(tagType, query);
      break;
    case TagPathsType.azure:
      result = runAzureTag(tagType, query);
      break;
    case TagPathsType.azureOcp:
      result = runAzureOcpTag(tagType, query);
      break;
    case TagPathsType.gcp:
      result = runGcpTag(tagType, query);
      break;
    case TagPathsType.gcpOcp:
      result = runGcpOcpTag(tagType, query);
      break;
    case TagPathsType.ibm:
      result = runIbmTag(tagType, query);
      break;
    case TagPathsType.ocp:
      result = runOcpTag(tagType, query);
      break;
    case TagPathsType.ocpCloud:
      result = runOcpCloudTag(tagType, query);
      break;
    case TagPathsType.rhel:
      result = runRhelTag(tagType, query);
      break;
  }
  return result;
}
