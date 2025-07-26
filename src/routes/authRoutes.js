// Importamos Express para definir las rutas
const express = require('express');
const router = express.Router();

// Importamos el controlador que maneja la lógica
const authController = require('../controllers/authController');

// -----------------------------
// REGISTRO / LOGIN / LOGOUT
// -----------------------------
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// -----------------------------
// RECUPERAR USUARIO (por correo)
// -----------------------------
router.post('/recuperar-usuario', authController.recuperarUsuario);

// -----------------------------
// SOLICITAR RECUPERACIÓN DE CONTRASEÑA (envía token)
// -----------------------------
router.post('/recuperar-contrasena', authController.enviarTokenRecuperacion);

// -----------------------------
// CAMBIAR CONTRASEÑA USANDO TOKEN
// -----------------------------
router.post('/resetear-contrasena', authController.cambiarContrasena);

module.exports = router;
