const express = require('express');
const pedidoRoutes= express.Router();

const { pedidoController } = require('../controller/pedidoController');

pedidoRoutes.get('/pedidos', pedidoController.buscarTodos);
pedidoRoutes.get('/pedidos/:id_pedido', pedidoController.buscarPorId);
pedidoRoutes.post('/pedidos/adicionar', pedidoController.adicionarPedido);
pedidoRoutes.put('/pedidos/atualizar/:id_pedido', pedidoController.atualizarPedido);
pedidoRoutes.delete('/pedidos/deletar/:id', pedidoController.deletarPedido);

module.exports = { pedidoRoutes };
