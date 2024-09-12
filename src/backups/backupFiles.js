const { spawn } = require('child_process');
const config = require('../config/config');
const path = require('path');
const logger = require('../utils/logger');
const sendEmail = require('../utils/email');
const successTemplate = require('../templates/successTemplate');
const errorTemplate = require('../templates/errorTemplate');
const moment = require('moment-timezone');

const getFormattedDateHour = () => {
  return moment().tz('America/Santiago').format('HH:mm:ss');
}

const getFormattedDate = () => {
  return moment().tz('America/Santiago').format('DD-MM-YYYY');
};

const backupFilesLinux = () => {
  const { sourceDir, backupPathVirtual, serverIp, serverUser, sshPort, sshKeyPath } = config;

  // Dividir el comando rsync en comando y argumentos
  const rsyncArgs = [
    '-avz',
    '--progress',
    '--stats',
    '-e', `ssh -i ${sshKeyPath} -p ${sshPort}`,
    `${serverUser}@${serverIp}:${sourceDir}`,
    `${backupPathVirtual}`
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
      const successText = `El proceso de respaldo de archivos completó exitosamente.`;
      const details = {
        title: successText,
        backupPath: config.backupPathOriginal,
        backupName: sourceDir,
        Hora : getFormattedDateHour()
      };
      sendEmail(
        `Respaldo de Archivos Tu Imagen ${getFormattedDate()}`,
        successText,
        successTemplate(details)
      );
    } else {
      logger.error(`File sync process exited with code ${code}`);
      sendEmail(
        `Error en el Proceso de Respaldo de archivos ${getFormattedDate()}`,
        'Ocurrió un error durante el proceso de respaldo.',
        errorTemplate(`Código de error: ${code}`),
        config.email.cc // Enviar con copia en caso de error
      );
    }
  });
};

const backupFiles = () => {
  const { sourceDir, backupPathVirtualMnt, serverIp, serverUser, sshPort, sshKeyPath } = config;

  // Definir el comando SSH sin comillas
  const sshCommand = `ssh -i ${sshKeyPath} -p ${sshPort}`;

  // Definir los argumentos de rsync, añadiendo la opción --rsync-path
  const rsyncArgs = [
    '-avz',
    '--progress',
    '--stats',
    '-vv',
    '-e', sshCommand,
    '--rsync-path', 'sudo rsync',  // Ejecutar rsync con sudo en el servidor remoto
    `${serverUser}@${serverIp}:${sourceDir}`,
    backupPathVirtualMnt
  ];

  logger.info('Starting file sync...');
  logger.info(`Executing command: rsync ${rsyncArgs.join(' ')}`);

  // Ejecutar rsync directamente
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
