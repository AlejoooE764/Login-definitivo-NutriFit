// Importamos Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importamos bcrypt para el hash de contraseñas
const bcrypt = require('bcrypt');

// Para generar token aleatorio
const crypto = require('crypto');

// Para enviar correos
const { enviarTokenPorCorreo } = require('../utils/emailSender');

// -----------------------------
// REGISTRO DE USUARIO
// -----------------------------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).send('Todos los campos son obligatorios.');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword
      }
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno al registrar usuario');
  }
};

// -----------------------------
// INICIO DE SESIÓN
// -----------------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).send('Correo y contraseña son requeridos.');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Contraseña incorrecta');
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    res.send('dashboard');
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send('Error interno en el servidor');
  }
};

// -----------------------------
// CIERRE DE SESIÓN
// -----------------------------
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
};

// -----------------------------
// RECUPERAR USUARIO POR CORREO
// -----------------------------
exports.recuperarUsuario = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).send('El correo es obligatorio.');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).send('No se encontró un usuario con ese correo');
    }

    res.send(`Tu nombre de usuario es: ${user.name || user.email}`);
  } catch (error) {
    console.error('Error al recuperar el usuario:', error);
    res.status(500).send('Error interno');
  }
};

// -----------------------------
// ENVÍO DE TOKEN POR CORREO
// -----------------------------
exports.enviarTokenRecuperacion = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'El correo es obligatorio.' });
    }

    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: 'Correo no encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
      },
    });

    await enviarTokenPorCorreo(email, token);

    res.status(200).json({ message: 'Se ha enviado un enlace de recuperación a tu correo.' });
  } catch (error) {
    console.error('Error al generar token:', error);
    res.status(500).json({ error: 'Error al generar el token de recuperación' });
  }
};

// -----------------------------
// CAMBIO DE CONTRASEÑA USANDO TOKEN
// -----------------------------
exports.cambiarContrasena = async (req, res) => {
  const { token, nuevaContrasena } = req.body;

  try {
    if (!token || !nuevaContrasena) {
      return res.status(400).send('Token y nueva contraseña son requeridos.');
    }

    const usuario = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(), // No expirado
        },
      },
    });

    if (!usuario) {
      return res.status(400).send('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await prisma.user.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.redirect('/confirmacion-exitosa.html');
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).send('Error al cambiar la contraseña');
  }
};
