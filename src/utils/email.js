// src/utils/email.js
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.auth.user,
    pass: config.email.auth.pass
  }
});

const sendEmail = (subject, text, html) => {
  const mailOptions = {
    from: config.email.from,
    to: config.email.to.join(','), // Unir la lista de destinatarios en una cadena separada por comas
    cc: config.email.cc.join(','), // Unir la lista de destinatarios en copia en una cadena separada por comas
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(`Error sending email: ${error}`);
      console.log('Error sending email:', error);
    } else {
      logger.info(`Email sent: ${info.response}`);
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;
