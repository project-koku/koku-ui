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
      'On-prem defaults to release-onprem.sh (assemble from main with HCCM/ROS prod tags).',
      'Choose direct merge to run release-branch.sh -q if the assemble path fails.\n',
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
        name: 'onpremMode',
        message: 'How do you want to release on-prem?',
        choices: [
          {
            name: 'Assemble from main with HCCM/ROS prod tags (recommended)',
            value: 'assemble',
          },
          {
            name: 'Direct merge main to release-onprem (may include in-progress HCCM/ROS work)',
            value: 'direct',
          },
        ],
        when: answers => process.env.APP_INTERFACE !== 'true' && answers.appEnv === 'koku-ui-onprem',
      },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which Chrome environment do you want to release?',
        choices: ['stage', 'prod', 'all'],
        when: () => process.env.APP_INTERFACE === 'true',
      },
      {
        name: 'updateForkMaster',
        message: "Do you want to update your app-interface fork's master?",
        type: 'confirm',
        default: true,
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
      const { appEnv, clouddotEnv, debug, onpremMode, updateForkMaster } = answers;
      process.env.DEBUG = debug.toString();

      const isAppInterface = process.env.APP_INTERFACE === 'true';
      const isHccm = appEnv === 'koku-ui-hccm' || appEnv === 'all';
      const isOnprem = appEnv === 'koku-ui-onprem';
      const isOnpremDirect = onpremMode === 'direct';
      const isProd = clouddotEnv === 'prod' || clouddotEnv === 'all';
      const isRos = appEnv === 'koku-ui-ros' || appEnv === 'all';
      const isStage = clouddotEnv === 'stage' || clouddotEnv === 'all';

      if (isAppInterface) {
        if (updateForkMaster) {
          appendArg('FORK_ARG', '-u');
        }
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
          process.env.ONPREM_ARG = isOnpremDirect ? '-q' : 'true';
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

  const isOnpremAssemble = process.env.ONPREM_ARG === 'true';
  const isOnpremDirect = process.env.ONPREM_ARG === '-q';
  if (process.env.APP_INTERFACE === 'true') {
    allArgs.push('release-app-interface.sh');
  } else if (isOnpremAssemble) {
    allArgs.push('release-onprem.sh');
  } else {
    allArgs.push('release-branch.sh');
  }

  if (!isOnpremAssemble || process.env.APP_INTERFACE === 'true') {
    const argVars = isOnpremDirect ? ['ONPREM_ARG'] : ['HCCM_ARG', 'ROS_ARG', 'FORK_ARG'];
    const deploymentArgs = argVars.flatMap(v => (process.env[v] || '').split(/\s+/)).filter(Boolean);
    allArgs.push(...deploymentArgs);
  }

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
