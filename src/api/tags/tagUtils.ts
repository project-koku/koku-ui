import { runTag as runAwsTag } from './awsTags';
import { runTag as runAzureTag } from './azureTags';
import { runTag as runGcpTag } from './gcpTags';
import { runTag as runOcpTag } from './ocpTags';
import { TagPathsType, TagType } from './tag';

export function runTag(tagPathsType: TagPathsType, tagType: TagType, query: string) {
  let tagReport;
  switch (tagPathsType) {
    case TagPathsType.aws:
      tagReport = runAwsTag(tagType, query);
      break;
    case TagPathsType.azure:
      tagReport = runAzureTag(tagType, query);
      break;
    case TagPathsType.gcp:
      tagReport = runGcpTag(tagType, query);
      break;
    case TagPathsType.ocp:
      tagReport = runOcpTag(tagType, query);
      break;
  }
  return tagReport;
}
