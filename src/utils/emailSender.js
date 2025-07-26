// src/utils/emailSender.js
const nodemailer = require('nodemailer');

// Configura el transporter (usamos Gmail en este ejemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com',       // ⚠️ Reemplaza con tu correo real
    pass: 'tupasswordoappkey',        // ⚠️ Usa una App Password si es Gmail con 2FA
  },
});

async function enviarTokenPorCorreo(destinatario, token) {
  const mailOptions = {
    from: '"NutriFit" <tucorreo@gmail.com>',
    to: destinatario,
    subject: 'Recuperación de contraseña - NutriFit',
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Este es tu token para recuperar la contraseña:</p>
      <h3>${token}</h3>
      <p>Ingresa este token en el formulario para establecer una nueva contraseña.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}

module.exports = { enviarTokenPorCorreo };
