import { List, ListItem, Title } from '@patternfly/react-core';
import CopyClipboard from 'components/copyClipboard';
import React from 'react';
import { InjectedTranslateProps, Interpolate } from 'react-i18next';

const IamPolicyInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
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
                AWS Identity Access Management* (IAM) console
              </a>
            }
            i18nKey="onboarding.iam_policy.sign_in"
          />
        </ListItem>
        <ListItem>
          {t('onboarding.iam_policy.new_policy')}
          <br />

          <CopyClipboard
            isToggle
            text={`{
	"Version": "2012-10-17",
	"Statement": [{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": [
				"s3:Get*",
				"s3:List*"
			],
			"Resource": [
				"arn:aws:s3:::bucket_name",
				"arn:aws:s3:::bucket_name/*"
			]
		},
		{
			"Sid": "VisualEditor1",
			"Effect": "Allow",
			"Action": [
				"s3:ListAllMyBuckets",
				"iam:ListAccountAliases",
				"cur:DescribeReportDefinitions"
			],
			"Resource": "*"
		}
	]
}`}
            aria-label="command line to obtain the token"
          />
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
