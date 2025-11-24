const express = require('express');
const clienteRoutes= express.Router();

const { clienteController } = require('../controller/clienteController');

clienteRoutes.get('/clientes', clienteController.buscarTodos);
clienteRoutes.get('/clientes/:id_cliente', clienteController.buscarPorId);
clienteRoutes.post('/clientes/adicionar', clienteController.criarCliente);


module.exports = { clienteRoutes };
