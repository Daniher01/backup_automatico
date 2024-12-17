const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  postgresConfigs: [
    {
      name: process.env.tuimagen_DB_NAME,
      host: process.env.tuimagen_DB_HOST,
      user: process.env.tuimagen_DB_USER,
      password: process.env.tuimagen_DB_PASSWORD,
      port: process.env.tuimagen_DB_PORT
    },
    // {
    //   name: process.env.otroproyecto_DB_NAME,
    //   host: process.env.otroproyecto_DB_HOST,
    //   user: process.env.otroproyecto_DB_USER,
    //   password: process.env.otroproyecto_DB_PASSWORD,
    //   port: process.env.otroproyecto_DB_PORT
    // }
  ],
  mysqlConfigs: [
    {
      name: process.env.tuimagen_lab_DB_NAME,
      host: process.env.tuimagen_lab_DB_HOST,
      user: process.env.tuimagen_lab_DB_USER,
      password: process.env.tuimagen_lab_DB_PASSWORD,
      port: process.env.tuimagen_lab_DB_PORT
    },
    // {
    //   name: process.env.nuevoproyecto_DB_NAME,
    //   host: process.env.nuevoproyecto_DB_HOST,
    //   user: process.env.nuevoproyecto_DB_USER,
    //   password: process.env.nuevoproyecto_DB_PASSWORD,
    //   port: process.env.nuevoproyecto_DB_PORT
    // }
  ],
  backupPathVirtual: process.env.BACKUP_PATH_VIRTUAL,
  backupPathVirtualMnt: process.env.BACKUP_PATH_VIRTUAL_MONTADO,
  backupPathOriginal: process.env.BACKUP_PATH_ORIGINAL,
  sourceDir: process.env.SOURCE_DIR,
  serverIp: process.env.SERVER_IP,
  serverUser: process.env.SERVER_USER,
  sshPort: process.env.SSH_PORT,
  sshKeyPath: process.env.SSH_KEY_PATH,
  email: {
    service: 'gmail',
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD
    },
    from: process.env.AUTH_USER,
    to: ['administracion@tuimagenrx.cl', 'francisco.toloza@tuimagenrx.cl', 'informatica@agenciaideaspro.cl'], // Lista de destinatarios principales
    cc: ['johakrys1109@gmail.com', 'daniher02@gmail.com', 'johangutierrez@outlook.cl'] // Lista de destinatarios en copia
  }
};