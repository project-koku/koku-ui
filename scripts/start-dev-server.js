/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

async function setEnv() {
  return inquirer
    .prompt([
      {
        name: 'localApi',
        message: 'Do you want to use local api?',
        type: 'confirm',
        default: false,
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use',
        choices: ['stage', 'prod', 'ci'],
        when: answers => answers.localApi === false,
      },
      {
        type: 'list',
        name: 'uiEnv',
        message: 'Which UI environment you want to use?',
        choices: ['beta', 'stable'],
        when: answers => answers.localApi === false,
      },
      {
        name: 'insightsProxy',
        message: 'Do you want to use the Insights proxy?',
        type: 'confirm',
        default: false,
        when: answers => answers.localApi === false,
      },
    ])
    .then(answers => {
      const { uiEnv, clouddotEnv, insightsProxy, localApi } = answers;
      process.env.BETA_ENV = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.USE_PROXY = (!insightsProxy).toString();
      process.env.USE_LOCAL_ROUTES = localApi.toString();
      if (localApi.toString()) {
        process.env.USE_PROXY = 'false';
      }
    });
}

async function run() {
  await setEnv();
  const child = spawn('yarn', ['start:dev'], {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd: resolve(__dirname, '../'),
  });
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
