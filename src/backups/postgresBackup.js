const { exec } = require('child_process');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');

const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const backupPostgresDatabase = (db) => {
  const { host, user, password, name, port } = db;
  const formattedDate = getFormattedDate();
  const backupPath = path.join(config.backupPath, `db_backup_${name}_${formattedDate}.sql`);
  const command = `pg_dump -h ${host} -U ${user} -p ${port} -d ${name} -Fc -f "${backupPath}"`;

  // Configurar las opciones para incluir la contraseña
  const env = { ...process.env, PGPASSWORD: password };

  exec(command, { env }, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during database backup for ${name}: ${error.message}`);
      return;
    }
    logger.info(`Database backup successful for ${name}: ${backupPath}`);
  });
};

const backupAllPostgresDatabases = () => {
  config.postgresConfigs.forEach(backupPostgresDatabase);
};

module.exports = backupAllPostgresDatabases;
