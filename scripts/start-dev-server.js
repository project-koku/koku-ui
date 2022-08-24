/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

async function setEnv() {
  return inquirer
    .prompt([
      {
        name: 'localCloudServicesConfig',
        message: 'Do you want to use local cloud services config?',
        type: 'confirm',
        default: false,
      },
      {
        name: 'localApi',
        message: 'Do you want to use local API?',
        type: 'confirm',
        default: false,
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use?',
        choices: ['stage', 'prod'],
      },
      {
        type: 'list',
        name: 'uiEnv',
        message: 'Which Chrome environment you want to use?',
        choices: ['beta', 'stable'],
      },
    ])
    .then(answers => {
      const { uiEnv, clouddotEnv, insightsProxy, localApi, localCloudServicesConfig } = answers;
      process.env.BETA_ENV = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.USE_PROXY = 'true';
      process.env.USE_LOCAL_ROUTES = localApi.toString();
      process.env.USE_LOCAL_CLOUD_SERVICES_CONFIG = localCloudServicesConfig.toString();
      if (localApi) {
        process.env.USE_PROXY = 'false';
        process.env.KEYCLOAK_PORT = 4020;
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
