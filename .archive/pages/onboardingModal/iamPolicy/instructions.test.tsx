import { ClipboardCopy } from '@patternfly/react-core';
import { shallow } from 'enzyme';
import React from 'react';
import IamPolicyInstructions from './instructions';

test('copy clipboard has s3 bucket name', () => {
  const bucketName = 'my_bucket_name_rocks';
  const view = shallow(
    <IamPolicyInstructions t={jest.fn(v => v)} s3BucketName={bucketName} />
  );
  const ccp = view.find(ClipboardCopy);
  expect(ccp).toHaveLength(1);
  expect(ccp.props().children).toMatch(`"arn:aws:s3:::${bucketName}"`);
  expect(ccp.props().children).toMatch(`"arn:aws:s3:::${bucketName}/*"`);
});
