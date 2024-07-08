const { exec } = require('child_process');
const config = require('../config/config');
const path = require('path');
const logger = require('../utils/logger');

const backupFiles = () => {
  const { sourceDir, backupPath, serverIp, serverUser, sshPort, sshKeyPath } = config;

  const rsyncCommand = `rsync -avz -e "ssh -i ${sshKeyPath} -p ${sshPort}" ${serverUser}@${serverIp}:${sourceDir} ${backupPath}/files`;


  exec(rsyncCommand, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during file sync: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.warn(`Warnings during file sync: ${stderr}`);
    }
    logger.info(`File sync completed successfully: ${stdout}`);
  });
};

module.exports = backupFiles;
