const { exec } = require('child_process');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');

const backupDatabase = () => {
  config.databases.forEach(db => {
    const { host, user, password, name, port } = db;
    const backupPath = path.join(config.backupPath, `db_backup_${name}_${Date.now()}.sql`);
    const command = `pg_dump -h ${host} -U ${user} -p ${port} -d ${name} -Fc -f ${backupPath}`;

    // Configurar las opciones para incluir la contraseña
    const env = { ...process.env, PGPASSWORD: password };

    exec(command, { env }, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error during database backup for ${name}: ${error.message}`);
        return;
      }
      logger.info(`Database backup successful for ${name}: ${backupPath}`);
    });
  });
};

module.exports = backupDatabase;