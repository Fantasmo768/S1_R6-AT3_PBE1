const express = require('express');
const entregaRoutes= express.Router();

const { entregaController } = require('../controller/entregaController');

entregaRoutes.get('/entregas', entregaController.buscarTodos);
entregaRoutes.get('/entregas/:id_entrega', entregaController.selectEntregaPorId);
entregaRoutes.post('/entregas/adicionar', entregaController.adicionarEntrega);
entregaRoutes.put('/entregas/atualizar/:id_entrega', entregaController.atualizarEntrega);
entregaRoutes.delete('/entregas/deletar/:id', entregaController.deletarEntrega);

module.exports = { entregaRoutes };