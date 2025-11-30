const { pedidoModel } = require("../model/pedidoModel");
const { entregaModel } = require("../model/entregaModel");

const entregaController = {

    buscarTodos: async (req, res) => {
        try {
            const entregas = await entregaModel.buscarTodasEntregas();;

            if (entregas.length === 0) {
                return req.status(200).json("Não existem entregas cadastradas na tabela");
            }

            return res.status(200).json(entregas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar entregas'
            });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const { id_entrega } = req.params;

            const id_entrega_num = Number(id_entrega);

            if (!id_entrega || !Number.isInteger(id_entrega_num)) {
                return res.status(400).json({ message: "Insira um ID válido" });
            }

            const resultado = await entregaModel.buscarEntregaPorId(id_entrega);

            if (resultado.length === 0) {
                return res.status(404).json({ message: "Entrega não encontrado" });
            }

            return res.status(200).json({ message: "entrega:", resultado })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar a entrega'
            });
        }
    },

    adicionarEntrega: async (req, res) => {

        try {
            const { status_entrega, id_pedido } = req.body;

            const status_entrega_string = String(status_entrega);
            const id_pedido_num = Number(id_pedido);

            if (!status_entrega || !id_pedido || !Number.isInteger(id_pedido_num) || typeof status_entrega_string !== "string") {
                return res.status(400).json({ message: "Você inseriu algum valor de maneira inadequada" });
            }

            if (status_entrega !== "calculado" && status_entrega !== "entregue" && status_entrega !== "em transito" && status_entrega !== "cancelado") {
                return res.status(400).json({ message: "Insira algum status de entrega que esteja de acordo com a lista: calculado, entrege, em transito ou cancelado" });
            }

            const pedidoSelecionado = await pedidoModel.buscarInfoPedido(id_pedido);

            const { distancia, peso, valor_km, valor_kg, entrega_urgente } = pedidoSelecionado[0];

            //#region Cálculo da entrega

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = distancia * valor_km;

            let valor_peso = peso * valor_kg;

            let valor_base = valor_distancia + valor_peso;

            let valor_final = valor_base;

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
                valor_final = valor_final * 0.9;
                desconto = valor_final * 0.1
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }
            //#endregion

            const resultado = await entregaModel.insertEntrega(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido);

            return res.status(201).json({ message: "Entrega adicionada com sucesso", resultado })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }


    },

    atualizarEntrega: async (req, res) => {
        try {
            const { id_entrega } = req.params;
            const { status_entrega, id_pedido } = req.body;

            const id_entrega_num = Number(id_entrega);

            if (!id_entrega || !Number.isInteger(id_entrega_num)) {
                return res.status(400).json({ message: "Insira um id válido." })
            }

            const entrega_atual = await pedidoModel.buscarPedidoPorId(id_entrega);

            const novo_status_entrega = status_entrega ?? entrega_atual[0].status_entrega;
            const novo_id_pedido = id_pedido ?? entrega_atual[0].id_pedido_fk;

            const novo_id_pedido_num = Number(novo_id_pedido);

            const pedidoSelecionado = await pedidoModel.buscarInfoPedido(novo_id_pedido);

            const { distancia, peso, valor_km, valor_kg, entrega_urgente } = pedidoSelecionado[0];

            if (!novo_status_entrega || !novo_id_pedido || !Number.isInteger(novo_id_pedido_num)) {
                return res.status(405).json({ message: "Você inseriu os valores de maneira inadequada." });
            }

            if (novo_status_entrega !== "calculado" && novo_status_entrega !== "entregue" && novo_status_entrega !== "em transito" && novo_status_entrega !== "cancelado") {
                return res.status(400).json({ message: "Insira algum status de entrega que esteja de acordo com a lista: calculado, entrege, em transito ou cancelado" });
            }

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = distancia * valor_km;

            let valor_peso = peso * valor_kg;

            let valor_base = valor_distancia + valor_peso;

            let valor_final = valor_base;

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
                valor_final = valor_final * 0.9;
                desconto = valor_final * 0.1
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }

            const resultado = await entregaModel.insertEntrega(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido, id_entrega);

            return res.status(201).json({ message: "Pedido atualizado com sucesso", resultado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    deletarEntrega: async (req, res) => {
        try {
            const id = req.params.id;
            const id_num = Number(id);

            if (!id || !Number.isInteger(id_num)) {
                return res.status(400).json({ message: "Insira um id válido" });
            }

            const entregaSelecionada = await entregaModel.buscarEntregaPorId(id);

            if (entregaSelecionada.length === 0) {
                return res.status(404).json("Pedido não encontrado");
            }

            const resultado = await pedidoModel(entregaSelecionada);

            return res.status(200).json({ message: "Entrega selecionada com sucesso!", resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao deletar a entrega'
            });
        }
    }
}

module.exports = { entregaController };