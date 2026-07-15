const express = require('express');
const router = express.Router();
const Iframe = require('../models/Iframe');
const { isAdmin } = require('../middleware/auth');

router.get('/admin/iframes', isAdmin, async (req, res) => {
  try {
    const iframes = await Iframe.find().sort({ createdAt: -1 });
    return res.json(iframes);
  } catch (err) {
    console.error('Error al obtener iframes:', err);
    return res.status(500).json({ error: 'Error al obtener iframes' });
  }
});

router.post('/admin/iframes', isAdmin, async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Nombre y URL son obligatorios' });
    }

    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return res.status(400).json({ error: 'La URL debe comenzar con http:// o https://' });
      }
    } catch {
      return res.status(400).json({ error: 'La URL no es válida' });
    }

    const existing = await Iframe.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe un iframe con ese nombre' });
    }

    const iframe = new Iframe({ name, url });
    await iframe.save();
    return res.status(201).json(iframe);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: msg });
    }
    console.error('Error al crear iframe:', err);
    return res.status(500).json({ error: 'Error al crear iframe' });
  }
});

router.put('/admin/iframes/:id', isAdmin, async (req, res) => {
  try {
    const { name, url } = req.body;
    const update = {};

    if (name !== undefined) {
      const existing = await Iframe.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ error: 'Ya existe un iframe con ese nombre' });
      }
      update.name = name;
    }

    if (url !== undefined) {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return res.status(400).json({ error: 'La URL debe comenzar con http:// o https://' });
        }
      } catch {
        return res.status(400).json({ error: 'La URL no es válida' });
      }
      update.url = url;
    }

    const iframe = await Iframe.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!iframe) {
      return res.status(404).json({ error: 'Iframe no encontrado' });
    }
    return res.json(iframe);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: msg });
    }
    console.error('Error al actualizar iframe:', err);
    return res.status(500).json({ error: 'Error al actualizar iframe' });
  }
});

router.delete('/admin/iframes/:id', isAdmin, async (req, res) => {
  try {
    const iframe = await Iframe.findByIdAndDelete(req.params.id);
    if (!iframe) {
      return res.status(404).json({ error: 'Iframe no encontrado' });
    }
    return res.json({ success: true, message: 'Iframe eliminado' });
  } catch (err) {
    console.error('Error al eliminar iframe:', err);
    return res.status(500).json({ error: 'Error al eliminar iframe' });
  }
});

module.exports = router;
