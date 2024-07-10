const winston = require('winston');
const moment = require('moment-timezone');

const timezoned = () => {
  return moment().tz('America/Santiago').format('YYYY-MM-DD HH:mm:ss');
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: timezoned }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'backup-automation.log' })
  ]
});

module.exports = logger;
