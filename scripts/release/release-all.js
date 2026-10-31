/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

function defaults() {
  process.env.DEBUG = 'false';
}

function usage() {
  console.log(
    [
      'Pushing to main builds images and updates stage.',
      'This script creates an MR that deploys app-interface prod from the latest SHA on main.',
      'MRs are created in your app-interface fork.\n',
    ].join('\n')
  );
}

function appendArg(name, flag) {
  process.env[name] = [process.env[name], flag].filter(Boolean).join(' ');
}

async function setConfig() {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'appEnv',
        message: 'Which app do you want to release?',
        choices: ['koku-ui-hccm', 'koku-ui-ros', 'all'],
      },
      {
        name: 'updateForkMaster',
        message: "Do you want to update your app-interface fork's master?",
        type: 'confirm',
        default: true,
      },
      {
        name: 'debug',
        message: 'Do you want to debug?',
        type: 'confirm',
        default: false,
      },
    ])
    .then(answers => {
      const { appEnv, debug, updateForkMaster } = answers;
      process.env.DEBUG = debug.toString();

      const isHccm = appEnv === 'koku-ui-hccm' || appEnv === 'all';
      const isRos = appEnv === 'koku-ui-ros' || appEnv === 'all';

      if (updateForkMaster) {
        appendArg('FORK_ARG', '-u');
      }
      if (isHccm) {
        appendArg('HCCM_ARG', '-s');
      }
      if (isRos) {
        appendArg('ROS_ARG', '-t');
      }
    });
}

async function run() {
  defaults();
  usage();

  await setConfig();

  const allArgs = [];
  if (process.env.DEBUG === 'true') {
    allArgs.push('-x');
  }

  allArgs.push('release-app-interface.sh');

  const argVars = ['HCCM_ARG', 'ROS_ARG', 'FORK_ARG'];
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
