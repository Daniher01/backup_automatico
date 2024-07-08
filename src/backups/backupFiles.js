const { exec } = require('child_process');
const config = require('../config/config');
const path = require('path');
const logger = require('../utils/logger');

// Función para convertir ruta de Windows a ruta de Cygwin
const convertPathToCygwin = (windowsPath) => {
  return windowsPath.replace(/\\/g, '/').replace(/C:/, '/cygdrive/c');
};

// Ruta al script de shell en formato de Windows
const scriptPath = path.resolve(__dirname, 'backupFiles.sh');
// Convertir la ruta de Windows a ruta de Cygwin
const cygwinScriptPath = convertPathToCygwin(scriptPath);

// Ruta a bash de Cygwin (asegúrate de que esta ruta sea correcta en tu instalación)
const cygwinBashPath = 'C:\\cygwin64\\bin\\bash.exe';

const backupFiles = () => {
  const { sourceDir, backupPath, serverIp, serverUser, sshPort, sshKeyPath } = config;

  const rsyncCommand = `rsync -avz -e "ssh -i ${sshKeyPath} -p ${sshPort}" ${serverUser}@${serverIp}:${sourceDir} ${backupPath}/files`;

  // Ejecutar el script de shell usando bash de Cygwin
  const command = `${cygwinBashPath} -l -c "${cygwinScriptPath}"`;

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
