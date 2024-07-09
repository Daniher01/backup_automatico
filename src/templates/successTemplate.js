// src/templates/successTemplate.js
const successTemplate = (details) => `
  <h2>${details.title}</h2>
  <p>Detalles:</p>
  <ul>
    <li><strong>Directorio de Respaldo:</strong> ${details.backupPath}</li>
    <li><strong>Nombre del archivo:</strong> ${details.backupName}</li>
    <li><strong>Hora del respaldo:</strong> ${details.Hora}</li>
  </ul>
  <p>Saludos,<br>Tu Sistema de Respaldo</p>
`;

module.exports = successTemplate;
