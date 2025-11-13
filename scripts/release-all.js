/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

function defaults() {
  process.env.APP_INTERFACE = 'false';
  process.env.DEBUG = 'false';
  process.env.HCCM_ARGS = '';
  process.env.ROS_ARGS = '';
}

async function setAppInterfaceConfig() {
  const { appInterfaceEnv } = await inquirer.prompt([
    {
      name: 'appInterfaceEnv',
      message: 'Do you want to release to app-interface?',
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
        message: 'Which Chrome environment you want to release?',
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

      if (appEnv === 'koku-ui-hccm' || appEnv === 'all') {
        if (clouddotEnv === 'stage') {
          process.env.HCCM_STAGE_ARG = '-s';
        } else if (clouddotEnv === 'prod') {
          process.env.HCCM_PROD_ARG = '-p';
        } else if (clouddotEnv === 'all') {
          process.env.HCCM_STAGE_ARG = '-s';
          process.env.HCCM_PROD_ARG = '-p';
        }
      }
      if (appEnv === 'koku-ui-ros' || appEnv === 'all') {
        if (clouddotEnv === 'stage') {
          process.env.ROS_STAGE_ARG = '-q';
        } else if (clouddotEnv === 'prod') {
          process.env.ROS_PROD_ARG = '-r';
        } else if (clouddotEnv === 'all') {
          process.env.ROS_STAGE_ARG = '-q';
          process.env.ROS_PROD_ARG = '-r';
        }
      }
    });
}

async function run() {
  defaults();
  await setAppInterfaceConfig();
  await setConfig();

  const allArgs = [];
  if (process.env.DEBUG === 'true') {
    allArgs.push('-x');
  }

  allArgs.push(process.env.APP_INTERFACE === 'true' ? 'release-app-interface.sh' : 'release-branch.sh');

  const argVars = ['HCCM_STAGE_ARG', 'HCCM_PROD_ARG', 'ROS_STAGE_ARG', 'ROS_PROD_ARG'];
  const deploymentArgs = argVars.map(v => process.env[v]).filter(Boolean);
  allArgs.push(...deploymentArgs);

  spawn('sh', allArgs, {
    stdio: [process.stdout, process.stdout, process.stdout],
    cwd: resolve(__dirname, '.'),
  });
}

try {
  run();
} catch (error) {
  console.error(error);
  process.exit(1);
}
