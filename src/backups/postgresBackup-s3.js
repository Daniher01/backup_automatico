const { exec } = require('child_process');
const AWS = require('aws-sdk');
const config = require('../config/config');
const logger = require('../utils/logger');
const path = require('path');
const sendEmail = require('../utils/email');
const successTemplate = require('../templates/successTemplate');
const errorTemplate = require('../templates/errorTemplate');
const moment = require('moment-timezone');
const fs = require('fs');

// Configurar AWS SDK para DigitalOcean Spaces
const s3 = new AWS.S3({
  endpoint: config.s3.endpoint,
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  region: config.s3.region
});

// Formatear fecha y hora
const getFormattedDateHour = () => moment().tz('America/Santiago').format('HH:mm:ss');
const getFormattedDate = () => moment().tz('America/Santiago').format('DD-MM-YYYY');

// Función para subir archivo a S3
const uploadToS3 = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('error', (err) => {
      reject(err);
    });

    const params = {
      Bucket: config.s3.bucket,
      Key: `${config.backupPathOriginal}${fileName}`, // Guardar en la carpeta 'backups/' del bucket
      Body: fileStream,
      ACL: 'private'
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

// Respaldo de PostgreSQL
const backupPostgresDatabase = (db) => {
  const { host, user, password, name, port } = db;
  const formattedDate = getFormattedDate();
  const backupName = `db_backup_${name}_${formattedDate}.sql`;
  const backupPath = path.join(config.backupPathVirtual, backupName);
  const command = `pg_dump -h ${host} -U ${user} -p ${port} -d ${name} -Fc -f "${backupPath}"`;

  // Configurar las opciones para incluir la contraseña
  const env = { ...process.env, PGPASSWORD: password };

  exec(command, { env }, async (error, stdout, stderr) => {
    if (error) {
      logger.error(`Error during database backup for ${name}: ${error.message}`);
      sendEmail(
        `Error en el Proceso de Respaldo de Bases de Datos ${getFormattedDate()}`,
        'Ocurrió un error durante el proceso de respaldo.',
        errorTemplate(`Código de error: ${error.message}`),
        config.email.cc
      );
      return;
    }

    try {
      // Subir respaldo a S3
      const s3Location = await uploadToS3(backupPath, backupName);
      logger.info(`Database backup uploaded to S3: ${s3Location}`);

      const successText = `El proceso de respaldo de la base de datos ${name} completó exitosamente.`;
      const details = {
        title: successText,
        backupPath: s3Location,
        backupName: backupName,
        Hora: getFormattedDateHour()
      };

      sendEmail(
        `Respaldo Bases de Datos ${getFormattedDate()}`,
        successText,
        successTemplate(details)
      );

      // Borrar respaldo local después de subirlo
      fs.unlink(backupPath, (err) => {
        if (err) logger.error(`Failed to delete local backup: ${err.message}`);
        else logger.info('Local backup deleted successfully.');
      });

    } catch (uploadError) {
      logger.error(`Error uploading backup to S3: ${uploadError.message}`);
      sendEmail(
        `Error al Subir Respaldo a S3 ${getFormattedDate()}`,
        'Ocurrió un error al subir el respaldo a S3.',
        errorTemplate(`Código de error: ${uploadError.message}`),
        config.email.cc
      );
    }
  });
};

// Respaldo de todas las bases de datos PostgreSQL
const backupAllPostgresDatabases = () => {
  config.postgresConfigs.forEach(backupPostgresDatabase);
};

module.exports = backupAllPostgresDatabases;
