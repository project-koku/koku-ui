/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

function defaults() {
  process.env.CLOUDOT_ENV = 'stage';
  process.env.APP_ENV = 'koku-ui-hccm';
  process.env.APP_INTERFACE_ENV = 'false';
}

async function setConfig() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'appEnv',
        message: 'Which app do you want to release?',
        choices: ['koku-ui-hccm', 'koku-ui-ros'],
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which Chrome environment you want to release?',
        choices: ['stage', 'prod'],
      },
      {
        name: 'appInterfaceEnv',
        message: 'Do you want to release to app-interface?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { appEnv, appInterfaceEnv, clouddotEnv } = answers;
      process.env.CLOUDOT_ENV = clouddotEnv || 'stage';
      process.env.APP_ENV = appEnv || 'koku-ui-hccm';
      process.env.APP_INTERFACE_ENV = appInterfaceEnv.toString();
    });
}

async function run() {
  defaults();
  await setConfig();

  const target =
    process.env.APP_INTERFACE_ENV === 'true'
      ? `release:app-interface:${process.env.CLOUDOT_ENV}`
      : `release:${process.env.CLOUDOT_ENV}`;

  spawn('npm', ['run', target, '--prefix', `apps/${process.env.APP_ENV}`], {
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
