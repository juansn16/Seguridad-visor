require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const path = require('path');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const iframeRoutes = require('./routes/iframes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 24 * 60 * 60
      }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true
      }
    }));

    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    const adminUser = await User.findOne({ role: 'admin' }).select('+password');
    if (!adminUser) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Usuario admin creado: admin / admin123');
    } else if (!adminUser.password.startsWith('$2a$') && !adminUser.password.startsWith('$2b$')) {
      console.log('[SEGURIDAD] Password del admin no hasheado. Rehasheando...');
      adminUser.password = 'admin123';
      await adminUser.save();
      console.log('Password del admin rehasheado correctamente');
    }

    app.use('/', authRoutes);
    app.use('/', adminRoutes);
    app.use('/', dashboardRoutes);
    app.use('/', iframeRoutes);

    app.use((req, res) => {
      res.status(404).sendFile('login.html', { root: 'public' });
    });

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1);
  });
