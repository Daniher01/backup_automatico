const { spawn } = require('child_process');
const config = require('../config/config');
const path = require('path');
const logger = require('../utils/logger');

const backupFiles = () => {
  const { sourceDir, backupPath, serverIp, serverUser, sshPort, sshKeyPath } = config;

  // Dividir el comando rsync en comando y argumentos
  const rsyncArgs = [
    '-avz',
    '--progress',
    '--stats',
    '-e', `ssh -i ${sshKeyPath} -p ${sshPort}`,
    `${serverUser}@${serverIp}:${sourceDir}`,
    `${backupPath}/files`
  ];

  logger.info('Starting file sync...');
  logger.info(`Executing command: rsync ${rsyncArgs.join(' ')}`);

  const rsync = spawn('rsync', rsyncArgs);

  rsync.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  rsync.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  rsync.on('close', (code) => {
    if (code === 0) {
      logger.info('File sync completed successfully.');
    } else {
      logger.error(`File sync process exited with code ${code}`);
    }
  });
};

module.exports = backupFiles;
