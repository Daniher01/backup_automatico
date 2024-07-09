const cron = require('node-cron');
const backupAllPostgresDatabases = require('./backups/postgresBackup');
const backupAllMysqlDatabases = require('./backups/mysqlBackup');
const backupFiles = require('./backups/backupFiles');
const logger = require('./utils/logger');

/*
* * * * *
| | | | |
| | | | +----- Día de la semana (0 - 7) (Domingo es 0 o 7)
| | | +------- Mes (1 - 12)
| | +--------- Día del mes (1 - 31)
| +----------- Hora (0 - 23)
+------------- Minuto (0 - 59)

*/

// ? ejecución automatica

// cron.schedule('* * * * *', () => {
//     logger.info('Starting scheduled database backup for tuimagen...');
//     backupAllPostgresDatabases();
//   });

// cron.schedule('0 3 * * *', () => {
//   logger.info('Starting file backup...');
//   backupFiles();
// });

// ? ejecucion manual
// logger.info('Starting manual database backup...');
//backupAllPostgresDatabases();
//backupAllMysqlDatabases();

logger.info('iniciando backcup files manual...')
backupFiles();

logger.info('Backup automation script started.');
