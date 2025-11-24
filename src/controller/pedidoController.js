const { pedidoModel } = require("../model/pedidoModel");
const { clienteModel } = require("../model/clienteModel");

const pedidoController = {
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
}

module.exports = { pedidoController }