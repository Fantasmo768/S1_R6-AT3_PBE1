const { pedidoModel } = require("../model/pedidoModel");
const { clienteModel } = require("../model/clienteModel");

const pedidoController = {
    adicionarPedido: async (req, res) => {

        try {
            const { data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente } = req.body;

            const id_cliente_num = Number(id_cliente);
            const distancia_num = Number(distancia);
            const peso_num = Number(peso);
            const valor_km_num = Number(valor_km);
            const valor_kg_num = Number(valor_kg);
            const entrega_urgente_bool = Boolean(entrega_urgente);

            const clienteSelecionado = await clienteModel.buscarPorId(id_cliente);

            if (!data_pedido || !entrega_urgente || !distancia || !peso || !valor_km || !id_cliente || !valor_kg || !Number.isInteger(id_cliente_num) || typeof entrega_urgente_bool !== "boolean" || typeof distancia_num !== "number" || typeof peso_num !== "number" || typeof valor_km_num !== "number" || typeof valor_kg_num !== "number" || distancia_num <= 0 || peso_num <= 0) {
                return res.status(405).json({ message: "Você inseriu os valores de maneira inadequada." });
            }

            if (clienteSelecionado === undefined) {
                return res.status(404).json({ message: "O cliente não existe" })
            }

            const pedidoAdicionado = await pedidoModel.adicionarPedido(data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente);

            return res.status(201).json({ message: "Pedido adicionado com sucesso", pedidoAdicionado });
        } catch (error) {
            console.error(error)
            return res.status(500).json({ message: "Erro interno do servidor" })
        }
    }
}

module.exports = { pedidoController }