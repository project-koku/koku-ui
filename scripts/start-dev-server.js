/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

async function setEnv() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use',
        choices: ['stage', 'prod', 'ci'],
      },
      { type: 'list', name: 'uiEnv', message: 'Which UI environment you want to use?', choices: ['beta', 'stable'] },
      {
        name: 'insightsProxy',
        message: 'Do you want to use the Insights proxy?',
        type: 'confirm',
        default: false,
      },
      // {
      //   name: 'localApi',
      //   message: 'Do you want to use local api?',
      //   type: 'confirm',
      //   default: false,
      // },
    ])
    .then(answers => {
      const { uiEnv, clouddotEnv, insightsProxy, localApi } = answers;

      process.env.BETA_ENV = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv;
      process.env.USE_PROXY = (!insightsProxy).toString(); // Set 'true' for webpack proxy
      // process.env.USE_LOCAL_ROUTES = localApi.toString();
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
