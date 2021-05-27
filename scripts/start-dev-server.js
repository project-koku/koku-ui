/* eslint-disable no-console */
const inquirer = require('inquirer');
const { resolve } = require('path');
const { spawn } = require('child_process');

async function setEnv() {
  return inquirer
    .prompt([
      { type: 'list', name: 'uiEnv', message: 'Which UI environment you want to use?', choices: ['stable', 'beta'] },
      {
        type: 'list',
        name: 'clouddotEnv',
        message: 'Which platform environment you want to use',
        choices: ['ci', 'qa', 'prod'],
      },
    ])
    .then(answers => {
      const { uiEnv, clouddotEnv } = answers;

      process.env.BETA_ENV = uiEnv === 'beta' ? 'true' : 'false';
      process.env.CLOUDOT_ENV = clouddotEnv;
      process.env.USE_PROXY = 'true';
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
