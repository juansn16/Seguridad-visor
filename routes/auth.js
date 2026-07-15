const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/dashboard');
  }
  res.sendFile('login.html', { root: 'public' });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    let isMatch;
    try {
      isMatch = await user.comparePassword(password);
    } catch (err) {
      if (err.message === 'PASSWORD_NOT_HASHED') {
        console.error(`[SEGURIDAD] La contraseña del usuario "${username}" no está hasheada. Rehasheando...`);
        user.password = password;
        await user.save();
        isMatch = await user.comparePassword(password);
      } else {
        throw err;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    return res.json({
      success: true,
      redirect: user.role === 'admin' ? '/admin' : '/dashboard'
    });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
