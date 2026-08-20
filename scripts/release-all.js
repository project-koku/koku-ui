/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

function defaults() {
  process.env.APP_INTERFACE = 'false';
  process.env.DEBUG = 'false';
}

function usage() {
  console.log(
    [
      'Use this script to create a PR, merging the release branch first.',
      'Run again to create an MR, deploying app-interface with the latest SHA refs from the same branch.',
      'Branch PRs are created in the koku-ui repo and MRs will be created in your app-interface fork.\n',
      'Note: This script does not support on-prem for app-interface.\n',
    ].join('\n')
  );
}

function appendArg(name, flag) {
  process.env[name] = [process.env[name], flag].filter(Boolean).join(' ');
}

async function setAppInterfaceConfig() {
  const { appInterfaceEnv } = await inquirer.prompt([
    {
      name: 'appInterfaceEnv',
      message: 'Are you deploying to app-interface?',
      type: 'confirm',
      default: false,
    },
  ]);
  process.env.APP_INTERFACE = appInterfaceEnv.toString();
}

async function setConfig() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'appEnv',
        message: 'Which app do you want to release?',
        choices:
          process.env.APP_INTERFACE === 'true'
            ? ['koku-ui-hccm', 'koku-ui-ros', 'all']
            : ['koku-ui-hccm', 'koku-ui-ros', 'koku-ui-onprem'],
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which Chrome environment do you want to release?',
        choices: ['stage', 'prod', 'all'],
        when: () => process.env.APP_INTERFACE === 'true',
      },
      {
        name: 'debug',
        message: 'Do you want to debug?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { appEnv, clouddotEnv, debug } = answers;
      process.env.DEBUG = debug.toString();

      const isAppInterface = process.env.APP_INTERFACE === 'true';
      const isHccm = appEnv === 'koku-ui-hccm' || appEnv === 'all';
      const isOnprem = appEnv === 'koku-ui-onprem';
      const isProd = clouddotEnv === 'prod' || clouddotEnv === 'all';
      const isRos = appEnv === 'koku-ui-ros' || appEnv === 'all';
      const isStage = clouddotEnv === 'stage' || clouddotEnv === 'all';

      if (isAppInterface) {
        if (isHccm && isStage) {
          appendArg('HCCM_ARG', '-p');
        }
        if (isHccm && isProd) {
          appendArg('HCCM_ARG', '-s');
        }
        if (isRos && isStage) {
          appendArg('ROS_ARG', '-r');
        }
        if (isRos && isProd) {
          appendArg('ROS_ARG', '-t');
        }
      } else {
        if (isHccm) {
          process.env.HCCM_ARG = '-p';
        }
        if (isOnprem) {
          process.env.ONPREM_ARG = '-q';
        }
        if (isRos) {
          process.env.ROS_ARG = '-r';
        }
      }
    });
}

async function run() {
  defaults();
  usage();

  await setAppInterfaceConfig();
  await setConfig();

  const allArgs = [];
  if (process.env.DEBUG === 'true') {
    allArgs.push('-x');
  }

  allArgs.push(process.env.APP_INTERFACE === 'true' ? 'release-app-interface.sh' : 'release-branch.sh');

  const argVars = ['HCCM_ARG', 'ONPREM_ARG', 'ROS_ARG'];
  const deploymentArgs = argVars.flatMap(v => (process.env[v] || '').split(/\s+/)).filter(Boolean);
  allArgs.push(...deploymentArgs);

  spawn('sh', allArgs, {
    stdio: 'inherit',
    cwd: resolve(__dirname, '.'),
  });
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
