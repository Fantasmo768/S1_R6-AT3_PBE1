const express = require('express');
const clienteRoutes= express.Router();

const { clienteController } = require('../controller/clienteController');

clienteRoutes.get('/clientes', clienteController.buscarTodos);
clienteRoutes.get('/clientes/:id_cliente', clienteController.buscarPorId);
clienteRoutes.post('/clientes/adicionar', clienteController.criarCliente);
clienteRoutes.put('/clientes/atualizar/:id', clienteController.atualizarCliente);
clienteRoutes.delete('/clietes/deletar/:id', clienteController.deletarCliente);

module.exports = { clienteRoutes };
