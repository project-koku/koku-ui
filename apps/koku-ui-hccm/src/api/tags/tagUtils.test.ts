import { TagPathsType, TagType } from './tag';
import { runTag } from './tagUtils';

jest.mock('./awsTags', () => ({ runTag: jest.fn(() => 'aws') }));
jest.mock('./awsOcpTags', () => ({ runTag: jest.fn(() => 'awsOcp') }));
jest.mock('./azureTags', () => ({ runTag: jest.fn(() => 'azure') }));
jest.mock('./azureOcpTags', () => ({ runTag: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpTags', () => ({ runTag: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpTags', () => ({ runTag: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpTags', () => ({ runTag: jest.fn(() => 'ocp') }));
jest.mock('./ocpCloudTags', () => ({ runTag: jest.fn(() => 'ocpCloud') }));

import { runTag as runAwsOcpTag } from './awsOcpTags';
import { runTag as runAwsTag } from './awsTags';
import { runTag as runAzureOcpTag } from './azureOcpTags';
import { runTag as runAzureTag } from './azureTags';
import { runTag as runGcpOcpTag } from './gcpOcpTags';
import { runTag as runGcpTag } from './gcpTags';
import { runTag as runOcpCloudTag } from './ocpCloudTags';
import { runTag as runOcpTag } from './ocpTags';

describe('runTag', () => {
  const query = 'key=env';

  test.each([
    [TagPathsType.aws, runAwsTag, 'aws'],
    [TagPathsType.awsOcp, runAwsOcpTag, 'awsOcp'],
    [TagPathsType.azure, runAzureTag, 'azure'],
    [TagPathsType.azureOcp, runAzureOcpTag, 'azureOcp'],
    [TagPathsType.gcp, runGcpTag, 'gcp'],
    [TagPathsType.gcpOcp, runGcpOcpTag, 'gcpOcp'],
    [TagPathsType.ocp, runOcpTag, 'ocp'],
    [TagPathsType.ocpCloud, runOcpCloudTag, 'ocpCloud'],
  ] as const)('dispatches %s tags', (pathType, fn, result) => {
    expect(runTag(pathType, TagType.tag, query)).toBe(result);
    expect(fn).toHaveBeenCalledWith(TagType.tag, query);
  });

  test('returns undefined for unknown path types', () => {
    expect(runTag('unknown' as TagPathsType, TagType.tag, query)).toBeUndefined();
  });
});
