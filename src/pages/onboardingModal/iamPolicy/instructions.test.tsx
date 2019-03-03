import CopyClipboard from 'components/copyClipboard';
import { shallow } from 'enzyme';
import React from 'react';
import IamPolicyInstructions from './instructions';

test('copy clipboard has s3 bucket name', () => {
  const bucketName = 'my_bucket_name_rocks';
  const view = shallow(
    <IamPolicyInstructions t={jest.fn(v => v)} s3BucketName={bucketName} />
  );
  const ccp = view.find(CopyClipboard);
  expect(ccp).toHaveLength(1);
  expect(ccp.props().text).toMatch(`"arn:aws:s3:::${bucketName}"`);
  expect(ccp.props().text).toMatch(`"arn:aws:s3:::${bucketName}/*"`);
});
