const express = require('express');
const pedidoRoutes= express.Router();

const { pedidoController } = require('../controller/pedidoController');

pedidoRoutes.post('/pedidos/adicionar', pedidoController.adicionarPedido);

module.exports = { pedidoRoutes };
