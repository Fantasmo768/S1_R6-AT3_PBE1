const express = require('express');
const entregaRoutes= express.Router();

const { entregaController } = require('../controller/entregaController');

entregaRoutes.post('/entregas/adicionar', entregaController.adicionarEntrega);

module.exports = { entregaRoutes };