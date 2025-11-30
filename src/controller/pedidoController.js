const { pedidoModel } = require("../model/pedidoModel");
const { clienteModel } = require("../model/clienteModel");

const pedidoController = {

    buscarTodos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.buscarTodosPedidos();

            if (pedidos.length === 0) {
                return req.status(200).json("Não existem pedidos cadastrados na tabela");
            }

            return res.status(200).json(pedidos);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar pedidos'
            });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const { id_pedido } = req.params;

            const id_pedido_num = Number(id_pedido);

            if (!id_pedido || !Number.isInteger(id_pedido_num)) {
                return res.status(400).json({ message: "Insira um ID válido" });
            }

            const resultado = await pedidoModel.buscarPedidoPorId(id_pedido);

            if (resultado.length === 0) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            return res.status(200).json({ message: "Pedido:", resultado })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar o pedido'
            });
        }
    },

    adicionarPedido: async (req, res) => {

        try {
            const { data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, status_entrega } = req.body;

            const id_cliente_num = Number(id_cliente);
            const distancia_num = Number(distancia);
            const peso_num = Number(peso);
            const valor_km_num = Number(valor_km);
            const valor_kg_num = Number(valor_kg);
            const entrega_urgente_bool = Boolean(entrega_urgente);

            if (!data_pedido || !entrega_urgente || !distancia || !peso || !valor_km || !id_cliente || !valor_kg || !Number.isInteger(id_cliente_num) || typeof entrega_urgente_bool !== "boolean" || typeof distancia_num !== "number" || typeof peso_num !== "number" || typeof valor_km_num !== "number" || typeof valor_kg_num !== "number" || distancia_num <= 0 || peso_num <= 0) {
                return res.status(405).json({ message: "Você inseriu os valores de maneira inadequada." });
            }

            const clienteSelecionado = await clienteModel.buscarPorId(id_cliente);

            if (clienteSelecionado.length === 0) {
                return res.status(404).json({ message: "O cliente não existe" })
            }

            const status_entrega_string = String(status_entrega);

            if (!status_entrega || typeof status_entrega_string !== "string") {
                return res.status(400).json({ message: "Você inseriu algum valor de maneira inadequada" });
            }

            if (status_entrega !== "calculado" && status_entrega !== "entregue" && status_entrega !== "em transito" && status_entrega !== "cancelado") {
                return res.status(400).json({ message: "Insira algum status de entrega que esteja de acordo com a lista: calculado, entrege, em transito ou cancelado" });
            }

            let valor_final;

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = distancia * valor_km;

            let valor_peso = peso * valor_kg;

            let valor_base = valor_distancia + valor_peso;

            if (peso > 50) {
                taxa = true;
            }

            if (entrega_urgente === true) {
                acrescimo = valor_base * 0.20;
                valor_final = valor_base + acrescimo;
            } else {
                valor_final = valor_base;
            }

            if (valor_final > 500) {
                desconto = valor_final * 0.1;
                valor_final = valor_final - desconto;
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }

            const pedidoAdicionado = await pedidoModel.adicionarPedido(data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega);

            return res.status(201).json({ message: "Pedido adicionado com sucesso", pedidoAdicionado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }

    },

    atualizarPedido: async (req, res) => {

        try {
            const { id_pedido } = req.params;
            const { data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, status_entrega } = req.body;

            const id_pedido_num = Number(id_pedido);

            if (!id_pedido || !Number.isInteger(id_pedido_num)) {
                return res.status(400).json({ message: "Insira um id válido." })
            }

            const pedido_atual = await pedidoModel.buscarPedidoPorId(id_pedido);

            const nova_data = data_pedido ?? pedido_atual[0].data_pedido;
            const nova_distancia = distancia ?? pedido_atual[0].distancia;
            const novo_peso = peso ?? pedido_atual[0].peso;
            const novo_valor_km = valor_km ?? pedido_atual[0].valor_km;
            const novo_valor_kg = valor_kg ?? pedido_atual[0].valor_kg;
            const novo_id_cliente = id_cliente ?? pedido_atual[0].id_cliente_fk;
            const novo_status_entrega = status_entrega ?? pedido_atual[0].status_entrega;
            const nova_entrega_urgente = entrega_urgente ?? pedido_atual[0].entrega_urgente;


            const id_cliente_num = Number(novo_id_cliente);
            const distancia_num = Number(nova_distancia);
            const peso_num = Number(novo_peso);
            const valor_km_num = Number(novo_valor_km);
            const valor_kg_num = Number(novo_valor_kg);
            const status_entrega_string = String(status_entrega);
            const entrega_urgente_bool = Boolean(nova_entrega_urgente);

            if (!nova_data || !nova_entrega_urgente || !nova_distancia || !novo_peso || !novo_valor_km || !novo_valor_kg || !novo_id_cliente || !novo_status_entrega || typeof status_entrega_string !== "string" || Number.isInteger(id_cliente_num) || typeof entrega_urgente_bool !== "boolean" || typeof distancia_num !== "number" || typeof peso_num !== "number" || typeof valor_km_num !== "number" || typeof valor_kg_num !== "number" || distancia_num <= 0 || peso_num <= 0) {
                return res.status(405).json({ message: "Você inseriu os valores de maneira inadequada." });
            }

            const clienteSelecionado = await clienteModel.buscarPorId(id_cliente);

            if (clienteSelecionado.length === 0) {
                return res.status(404).json({ message: "O cliente não existe" })
            }

            if (novo_status_entrega !== "calculado" && novo_status_entrega !== "entregue" && novo_status_entrega !== "em transito" && novo_status_entrega !== "cancelado") {
                return res.status(400).json({ message: "Insira algum status de entrega que esteja de acordo com a lista: calculado, entrege, em transito ou cancelado" });
            }

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = nova_distancia * novo_valor_km;

            let valor_peso = novo_peso * novo_valor_kg;

            let valor_base = valor_distancia + valor_peso;

            let valor_final = valor_base;

            if (novo_peso > 50) {
                taxa = true;
            }

            if (nova_entrega_urgente === true) {
                acrescimo = valor_base * 0.20;
                valor_final = valor_base + acrescimo;
            } else {
                valor_final = valor_base;
            }

            if (valor_final > 500) {
                desconto = valor_final * 0.1;
                valor_final = valor_final - desconto;
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }

            const resultado = await pedidoModel.atualizarPedido(data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, id_pedido, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega);

            return res.status(201).json({ message: "Pedido atualizado com sucesso", resultado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }

    },

    deletarPedido: async (req, res) => {

        try {
            const id = req.params.id;
            const id_num = Number(id);

            if (!id || !Number.isInteger(id_num)) {
                return res.status(400).json({ message: "Insira um id válido" });
            }

            const pedidoSelecionado = await pedidoModel.buscarPedidoPorId(id);

            if (pedidoSelecionado.length === 0) {
                return res.status(404).json("Pedido não encontrado");
            }

            const resultado = await pedidoModel(pedidoSelecionado);

            return res.status(200).json({ message: "Pedido deletado com sucesso!", resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao deletar o pedido'
            });
        }

    }


}

module.exports = { pedidoController }