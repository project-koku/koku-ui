import { runTag as runAwsOcpTag } from './awsOcpTags';
import { runTag as runAwsTag } from './awsTags';
import { runTag as runAzureOcpTag } from './azureOcpTags';
import { runTag as runAzureTag } from './azureTags';
import { runTag as runGcpOcpTag } from './gcpOcpTags';
import { runTag as runGcpTag } from './gcpTags';
import { runTag as runIbmTag } from './ibmTags';
import { runTag as runOciTag } from './ociTags';
import { runTag as runOcpCloudTag } from './ocpCloudTags';
import { runTag as runOcpTag } from './ocpTags';
import { TagPathsType, TagType } from './tag';

export function runTag(tagPathsType: TagPathsType, tagType: TagType, query: string) {
  let tagReport;
  switch (tagPathsType) {
    case TagPathsType.aws:
      tagReport = runAwsTag(tagType, query);
      break;
    case TagPathsType.awsOcp:
      tagReport = runAwsOcpTag(tagType, query);
      break;
    case TagPathsType.azure:
      tagReport = runAzureTag(tagType, query);
      break;
    case TagPathsType.oci:
      tagReport = runOciTag(tagType, query);
      break;
    case TagPathsType.azureOcp:
      tagReport = runAzureOcpTag(tagType, query);
      break;
    case TagPathsType.gcp:
      tagReport = runGcpTag(tagType, query);
      break;
    case TagPathsType.gcpOcp:
      tagReport = runGcpOcpTag(tagType, query);
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
