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
      'Use this script to create a PR, merging stage and prod branches first.',
      'Run again to create an MR, deploying app-interface with the latest SHA refs from the same branches.',
      'Branch PRs are created in the koku-ui repo and MRs will be created in your app-interface fork.\n',
    ].join('\n')
  );
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
            : ['koku-ui-hccm', 'koku-ui-ros'],
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which Chrome environment do you want to release?',
        choices: process.env.APP_INTERFACE === 'true' ? ['stage', 'prod', 'all'] : ['stage', 'prod'],
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

      const isHccm = appEnv === 'koku-ui-hccm' || appEnv === 'all';
      const isRos = appEnv === 'koku-ui-ros' || appEnv === 'all';
      const isStage = clouddotEnv === 'stage' || clouddotEnv === 'all';
      const isProd = clouddotEnv === 'prod' || clouddotEnv === 'all';

      if (isHccm && isStage) {
        process.env.HCCM_STAGE_ARG = '-s';
      }
      if (isHccm && isProd) {
        process.env.HCCM_PROD_ARG = '-p';
      }
      if (isRos && isStage) {
        process.env.ROS_STAGE_ARG = '-q';
      }
      if (isRos && isProd) {
        process.env.ROS_PROD_ARG = '-r';
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

  allArgs.push(process.env.APP_INTERFACE === 'true' ? 'deploy-branch.sh' : 'merge-branch.sh');

  const argVars = ['HCCM_STAGE_ARG', 'HCCM_PROD_ARG', 'ROS_STAGE_ARG', 'ROS_PROD_ARG'];
  const deploymentArgs = argVars.map(v => process.env[v]).filter(Boolean);
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
