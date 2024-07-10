const { exec } = require('child_process');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');
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

const backupPostgresDatabase = (db) => {
  const { host, user, password, name, port } = db;
  const formattedDate = getFormattedDate();
  const backupName = `db_backup_${name}_${formattedDate}.sql`;
  const backupPath = path.join(config.backupPathVirtual, backupName);
  const command = `pg_dump -h ${host} -U ${user} -p ${port} -d ${name} -Fc -f "${backupPath}"`;

  // Configurar las opciones para incluir la contraseña
  const env = { ...process.env, PGPASSWORD: password };

  exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during database backup for ${name}: ${error.message}`);
      sendEmail(
        `Error en el Proceso de Respaldo de Bases de Datos ${getFormattedDate()}`,
        'Ocurrió un error durante el proceso de respaldo.',
        errorTemplate(`Código de error: ${error.message}`)
      );
      return;
    }
    const successText = `El proceso de respaldo de la base de datos ${name} completó exitosamente.`;
    logger.info(`Database backup successful for ${name}: ${backupPath}`);
    const details = {
      title: successText,
      backupPath: config.backupPathOriginal,
      backupName: backupName,
      Hora : getFormattedDateHour()
    };
    sendEmail(
      `Respaldo Bases de datos ${getFormattedDate()}`,
      successText,
      successTemplate(details)
    );
  });
};

const backupAllPostgresDatabases = () => {
  config.postgresConfigs.forEach(backupPostgresDatabase);
};

module.exports = backupAllPostgresDatabases;
