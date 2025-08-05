// src/utils/emailSender.js

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configura el transporter con Gmail y App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // 💡 Tu correo en .env
    pass: process.env.EMAIL_PASS, // 💡 App Password si tienes 2FA
  },
});

/**
 * Envía un token de recuperación al correo del usuario.
 * @param {string} destinatario - Email del usuario
 * @param {string} token - Token generado para recuperar contraseña
 */
async function enviarTokenPorCorreo(destinatario, token) {
  const mailOptions = {
    from: `"NutriFit" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '🔐 Recuperación de contraseña - NutriFit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Recuperación de contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>NutriFit</strong>.</p>
        <p>Este es tu token de recuperación:</p>
        <h3 style="color: #e74c3c;">${token}</h3>
        <p>Este token expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <br>
        <p>Gracias,<br>El equipo de NutriFit</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Correo de recuperación enviado con éxito');
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    throw error;
  }
}

/**
 * Envía el nombre de usuario al correo del usuario.
 * @param {string} destinatario - Email del usuario
 * @param {string} nombreUsuario - Nombre de usuario registrado
 */
async function enviarUsuarioPorCorreo(destinatario, nombreUsuario) {
  const mailOptions = {
    from: `"NutriFit" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: '📧 Recuperación de Usuario - NutriFit',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Recuperación de Usuario</h2>
        <p>Hola,</p>
        <p>Tu nombre de usuario registrado en <strong>NutriFit</strong> es:</p>
        <h3 style="color: #2980b9;">${nombreUsuario}</h3>
        <p>Si no solicitaste esta información, puedes ignorar este mensaje.</p>
        <br>
        <p>Gracias,<br>El equipo de NutriFit</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Correo de nombre de usuario enviado con éxito');
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
    throw error;
  }
}

module.exports = {
  enviarTokenPorCorreo,
  enviarUsuarioPorCorreo, // ✅ Usamos este nombre para coincidir con el controlador
};
