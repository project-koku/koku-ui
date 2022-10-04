/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

function defaults() {
  process.env.BETA_ENV = 'true';
  process.env.CLOUDOT_ENV = 'stage';
  process.env.USE_PROXY = 'true';
  process.env.USE_EMPHEMERAL_ROUTES = 'false';
  process.env.USE_LOCAL_ROUTES = 'false';
  process.env.USE_LOCAL_CLOUD_SERVICES_CONFIG = 'false';
}

async function setupEnv() {
  return inquirer
    .prompt([
      {
        name: 'setup',
        message: 'Do you want to setup the run environment?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { setup } = answers;
      process.env.SETUP_ENV = setup;
    });
}

async function setupEphemeralRoutes() {
  return inquirer
    .prompt([
      {
        name: 'ephemeralRoutes',
        message: 'Do you want to use ephemeral API routes?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { ephemeralRoutes } = answers;
      process.env.USE_EMPHEMERAL_ROUTES = ephemeralRoutes.toString();
    });
}

async function setupLocalRoutes() {
  return inquirer
    .prompt([
      {
        name: 'localRoutes',
        message: 'Do you want to use local API routes?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { localRoutes } = answers;
      process.env.USE_LOCAL_ROUTES = localRoutes.toString();
      if (localRoutes) {
        process.env.USE_PROXY = 'false';
        process.env.KEYCLOAK_PORT = 4020;
      }
    });
}

async function setConfig() {
  return inquirer
    .prompt([
      {
        name: 'localCloudServicesConfig',
        message: 'Do you want to use local cloud services config?',
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
      const { uiEnv, clouddotEnv, localCloudServicesConfig } = answers;
      process.env.USE_LOCAL_CLOUD_SERVICES_CONFIG = localCloudServicesConfig.toString();
      process.env.CLOUDOT_ENV = clouddotEnv ? clouddotEnv : 'stage';
      process.env.BETA_ENV = uiEnv === 'beta' ? 'true' : 'false';
    });
}

async function run() {
  defaults();
  await setupEnv();
  if (process.env.SETUP_ENV === 'true') {
    await setupEphemeralRoutes();
    if (process.env.USE_EMPHEMERAL_ROUTES !== 'true') {
      await setupLocalRoutes();
    }
    await setConfig();
  }
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
