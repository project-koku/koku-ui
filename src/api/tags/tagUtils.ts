import { runTag as runAwsCloudTag } from './awsCloudTags';
import { runTag as runAwsTag } from './awsTags';
import { runTag as runAzureCloudTag } from './azureCloudTags';
import { runTag as runAzureTag } from './azureTags';
import { runTag as runGcpTag } from './gcpTags';
import { runTag as runIbmTag } from './ibmTags';
import { runTag as runOcpCloudTag } from './ocpCloudTags';
import { runTag as runOcpTag } from './ocpTags';
import { TagPathsType, TagType } from './tag';

export function runTag(tagPathsType: TagPathsType, tagType: TagType, query: string) {
  let tagReport;
  switch (tagPathsType) {
    case TagPathsType.aws:
      tagReport = runAwsTag(tagType, query);
      break;
    case TagPathsType.awsCloud:
      tagReport = runAwsCloudTag(tagType, query);
      break;
    case TagPathsType.azure:
      tagReport = runAzureTag(tagType, query);
      break;
    case TagPathsType.azureCloud:
      tagReport = runAzureCloudTag(tagType, query);
      break;
    case TagPathsType.gcp:
      tagReport = runGcpTag(tagType, query);
      break;
    case TagPathsType.ibm:
      tagReport = runIbmTag(tagType, query);
      break;
    case TagPathsType.ocp:
      tagReport = runOcpTag(tagType, query);
      break;
    case TagPathsType.ocpCloud:
      tagReport = runOcpCloudTag(tagType, query);
      break;
  }
  return tagReport;
}
