import {
  ClipboardCopy,
  ClipboardCopyVariant,
  List,
  ListItem,
  Title,
} from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

interface Props extends InjectedTranslateProps {
  s3BucketName: string;
}

const IamPolicyInstructions: React.SFC<Props> = ({ t, s3BucketName }) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.iam_policy.instructions_title')}</Title>
      <div>{t('onboarding.iam_policy.intro')}</div>
      <br />
      <List>
        <ListItem>
          <Interpolate
            iampolicy={
              <a
                href="https://docs.aws.amazon.com/IAM/latest/UserGuide/console.html"
                target="_blank"
              >
                {t('onboarding.iam_policy.link_text')}
              </a>
            }
            i18nKey="onboarding.iam_policy.sign_in"
          />
        </ListItem>
        <ListItem>
          {t('onboarding.iam_policy.new_policy')}
          <br />
          <ClipboardCopy
            textAriaLabel={t('onboarding.iam_policy.json_content')}
            variant={ClipboardCopyVariant.expansion}
          >
            {`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
              "arn:aws:s3:::${s3BucketName}",
              "arn:aws:s3:::${s3BucketName}/*"
            ]
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": [
                "s3:ListAllMyBuckets",
                "iam:ListAccountAliases",
                "s3:HeadBucket",
                "cur:DescribeReportDefinitions",
                "organizations:List*",
                "organizations:Describe*"
            ],
            "Resource": "*"
        }
    ]
}`}
          </ClipboardCopy>
        </ListItem>
        <ListItem>{t('onboarding.iam_policy.complete_process')}</ListItem>
      </List>
      <br />
      <br />
      <div>
        <b>{t('onboarding.iam_policy.donot_close_browser')}</b>
        {t('onboarding.iam_policy.note')}
      </div>
    </React.Fragment>
  );
};

export default IamPolicyInstructions;
