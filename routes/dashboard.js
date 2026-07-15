const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile('dashboard.html', { root: 'public' });
});

router.get('/dashboard/user', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('iframes').select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json({
      username: user.username,
      role: user.role,
      iframes: user.iframes
    });
  } catch (err) {
    console.error('Error al obtener datos del usuario:', err);
    return res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

module.exports = router;
