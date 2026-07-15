function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return res.redirect('/');
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  return res.redirect('/');
}

function isUser(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return res.redirect('/');
}

module.exports = { isAuthenticated, isAdmin, isUser };
