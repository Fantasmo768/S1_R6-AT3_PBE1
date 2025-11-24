const { pedidoModel } = require("../model/pedidoModel");
const { entregaModel } = require("../model/entregaModel");

const entregaController = {
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
                acrescimo = valor_base*0.20;
                valor_final = valor_base + acrescimo;
            } else {
                valor_final = valor_base;
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }

            if (valor_final > 500) {
                valor_final = valor_final * 0.8;
                desconto = valor_final * 0.2
            }

            const resultado = await entregaModel.insertEntrega(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido);

            console.log(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido)
            return res.status(201).json({message: "Entrega adicionada com sucesso", resultado})

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }


    }
}

module.exports = {entregaController};