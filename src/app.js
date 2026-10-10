const express = require('express');

function createApp() {
  const app = express();
  app.use(express.json());

  // Estado en memoria (suficiente para el taller)
  let nextId = 3;
  const tareas = [
    { id: 1, titulo: 'Desplegar con GitHub Actions', hecha: true },
    { id: 2, titulo: 'Publicar la imagen en GHCR', hecha: false },
  ];

  // CORS simple para que el frontend en GitHub Pages pueda llamar a la API
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/version', (req, res) => {
    res.json({
      version: process.env.APP_VERSION || 'dev',
      commit: process.env.GIT_SHA || 'local',
    });
  });

  app.get('/api/tareas', (req, res) => {
    res.json(tareas);
  });

  app.post('/api/tareas', (req, res) => {
    const titulo = (req.body && req.body.titulo || '').trim();
    if (!titulo) {
      return res.status(400).json({ error: 'El campo "titulo" es obligatorio' });
    }
    const tarea = { id: nextId++, titulo, hecha: false };
    tareas.push(tarea);
    return res.status(201).json(tarea);
  });

  app.patch('/api/tareas/:id', (req, res) => {
    const tarea = tareas.find((t) => t.id === Number(req.params.id));
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    tarea.hecha = Boolean(req.body && req.body.hecha);
    return res.json(tarea);
  });

  return app;
}

module.exports = { createApp };
