const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

const backupFiles = () => {
  const sourceDir = 'path/to/source/directory';
  const backupDir = `${config.backupPath}/files_backup_${Date.now()}`;

  fs.mkdirSync(backupDir, { recursive: true });

  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      logger.error(`Error reading source directory: ${err.message}`);
      return;
    }

    files.forEach(file => {
      const srcFile = path.join(sourceDir, file);
      const destFile = path.join(backupDir, file);

      fs.copyFile(srcFile, destFile, err => {
        if (err) {
          logger.error(`Error copying file ${file}: ${err.message}`);
        } else {
          logger.info(`File backed up: ${file}`);
        }
      });
    });
  });
};

module.exports = backupFiles;
