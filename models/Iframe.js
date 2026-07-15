const mongoose = require('mongoose');

const iframeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true
  },
  url: {
    type: String,
    required: [true, 'La URL es obligatoria'],
    trim: true,
    validate: {
      validator: function (v) {
        try {
          const url = new URL(v);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      },
      message: 'La URL no es válida. Debe comenzar con http:// o https://'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Iframe', iframeSchema);
