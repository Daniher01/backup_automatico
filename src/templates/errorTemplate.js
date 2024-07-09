// src/templates/errorTemplate.js
const errorTemplate = (error) => `
  <h2>Error en el Proceso de Respaldo</h2>
  <p>Ocurrió un error durante el proceso de respaldo.</p>
  <p>Detalles del Error:</p>
  <pre>${error}</pre>
  <p>Por favor revisa el problema.</p>
  <p>Saludos,<br>Tu Sistema de Respaldo</p>
`;

module.exports = errorTemplate;
