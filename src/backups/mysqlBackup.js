const { exec } = require('child_process');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');

const getFormattedDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0]; // Formato YYYY-MM-DD
};

const backupMysqlDatabase = (db) => {
  const { host, user, password, name, port } = db;
  const formattedDate = getFormattedDate();
  const backupPath = path.join(config.backupPathVirtual, `db_backup_${name}_${formattedDate}.sql`);
  const command = `mysqldump -h ${host} -u ${user} -p${password} -P ${port} ${name} > "${backupPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during database backup for ${name}: ${error.message}`);
      return;
    }
    logger.info(`Database backup successful for ${name}: ${backupPath}`);
  });
};

const backupAllMysqlDatabases = () => {
  config.mysqlConfigs.forEach(backupMysqlDatabase);
};

module.exports = backupAllMysqlDatabases;
