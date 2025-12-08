const { pedidoModel } = require("../model/pedidoModel");
const { clienteModel } = require("../model/clienteModel");
const { entregaModel } = require("../model/entregaModel");

const pedidoController = {

    /**
 * @async
 * @function buscarTodos
 * Busca e retorna todos os pedidos cadastrados no banco de dados.
 *
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP usado para envio dos dados.
 *
 * @returns {Promise<Object>} Retorna um array com todos os pedidos cadastrados.
 *
 * @throws {500} Caso ocorra algum erro inesperado ao buscar pedidos.
 *
 * @example
 * // GET /pedidos
 * const pedidos = await pedidoController.buscarTodos(req, res);
 *
 * // Resultado esperado:
 * [
 *   {
 *     "id_pedido": 1,
 *     "data_pedido": "2024-11-20",
 *     "distancia": 40,
 *     "peso": 20,
 *     "valor_km": 5,
 *     "valor_kg": 2,
 *     "entrega_urgente": false,
 *     "id_cliente_fk": 3
 *   }
 * ]
 */

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

    /**
 * @async
 * @function buscarPorId
 * @description Busca um pedido no banco de dados de acordo com o ID informado nos parâmetros da requisição.
 * 
 * @param {Object} req Objeto de requisição do Express contendo os parâmetros enviados pelo cliente.
 * @param {Object} res Objeto de resposta do Express utilizado para retornar o resultado da operação.
 *
 * @returns {JSON} Retorna um JSON com o pedido encontrado ou uma mensagem de erro caso não exista.
 * 
 * @example
 * // Requisição:
 * GET /pedidos/5
 * 
 * // Resposta esperada:
 * {
 *   "id_pedido": 5,
 *   "descricao": "Entrega de documentos",
 *   "valor": 45.90,
 *   "status": "Em andamento"
 * }
 * 
 * @example
 * // Caso ID não exista:
 * GET /pedidos/999
 * 
 * // Resposta esperada:
 * {
 *   "message": "Pedido não encontrado"
 * }
 */

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

    /**
* @async
* @function adicionarPedido
* @description Adiciona um novo pedido ao banco de dados após validar todos os dados enviados na requisição
* e calcular o valor final da entrega (considerando distância, peso, urgência, descontos e taxa adicional).
* 
* @param {Object} req Objeto de requisição do Express contendo os dados do pedido enviados no corpo da requisição.
* @param {Object} res Objeto de resposta do Express utilizado para retornar o resultado da operação.
*
* @returns {JSON} Retorna uma mensagem de sucesso e os dados do pedido cadastrado ou mensagens de erro de validação.
* 
* @example
* // Requisição:
* POST /pedidos
* {
*   "data_pedido": "2025-11-28",
*   "entrega_urgente": true,
*   "distancia": 12,
*   "peso": 30,
*   "valor_km": 2.50,
*   "valor_kg": 1.80,
*   "id_cliente": 7,
*   "status_entrega": "calculado"
* }
* 
* // Resposta esperada:
* {
*   "message": "Pedido adicionado com sucesso",
*   "pedidoAdicionado": {
*       "id_pedido": 21,
*       "valor_final": 142.8,
*       ...
*   }
* }
*
* @example
* // Caso o cliente não exista:
* POST /pedidos
* {
*   "id_cliente": 999
* }
*
* // Resposta esperada:
* {
*   "message": "O cliente não existe"
* }
*/

    adicionarPedido: async (req, res) => {

        try {
            const { data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, status_entrega } = req.body;

            const id_cliente_num = Number(id_cliente);
            const distancia_num = Number(distancia);
            const peso_num = Number(peso);
            const valor_km_num = Number(valor_km);
            const valor_kg_num = Number(valor_kg);
            const entrega_urgente_bool = Boolean(entrega_urgente);

            if (!data_pedido || entrega_urgente === undefined || entrega_urgente === null || !distancia || !peso || !valor_km || !id_cliente || !valor_kg || !Number.isInteger(id_cliente_num) || typeof entrega_urgente_bool !== "boolean" || typeof distancia_num !== "number" || typeof peso_num !== "number" || typeof valor_km_num !== "number" || typeof valor_kg_num !== "number" || distancia_num <= 0 || peso_num <= 0) {
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
                desconto = valor_final * 0.1;
                valor_final = valor_final - desconto;
            }

            if (taxa === true) {
                valor_final = valor_final + 15;
            }



            const pedidoAdicionado = await pedidoModel.adicionarPedido(data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega);
            console.log(pedidoAdicionado);

            return res.status(201).json({ message: "Pedido adicionado com sucesso", pedidoAdicionado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }

    },

    /**
 * @async
 * @function atualizarPedido
 * @description Atualiza um pedido existente no banco de dados com base no id informado.
 * Caso algum campo não seja enviado no corpo da requisição, o valor atual do pedido é mantido.
 * A função também recalcula automaticamente o valor final da entrega, levando em conta:
 * distância, peso, urgência, descontos e taxas adicionais.
 * 
 * @param {Object} req Objeto de requisição do Express contendo:
 * - `params.id_pedido` → identificador do pedido
 * - `body` → campos a serem atualizados
 * @param {Object} res Objeto de resposta do Express, usado para retornar mensagens e dados ao cliente.
 *
 * @returns {JSON} Mensagem de sucesso e o objeto atualizado, ou mensagens de validação/erro.
 *
 * @example
 * // Requisição:
 * PUT /pedidos/15
 * {
 *   "distancia": 20,
 *   "peso": 80,
 *   "entrega_urgente": false,
 *   "status_entrega": "em transito"
 * }
 * 
 * // Resposta esperada:
 * {
 *   "message": "Pedido atualizado com sucesso",
 *   "resultado": {
 *      "id_pedido": 15,
 *      "valor_final": 310.5,
 *      ...
 *   }
 * }
 *
 * @example
 * // Caso o ID seja inválido:
 * PUT /pedidos/abc
 *
 * // Resposta:
 * {
 *   "message": "Insira um id válido."
 * }
 *
 * @example
 * // Caso o pedido não exista:
 * PUT /pedidos/9999
 *
 * // Resposta:
 * {
 *   "message": "Pedido não encontrado"
 * }
 */

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

            console.log(data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, status_entrega)

            const id_cliente_num = Number(novo_id_cliente);
            const distancia_num = Number(nova_distancia);
            const peso_num = Number(novo_peso);
            const valor_km_num = Number(novo_valor_km);
            const valor_kg_num = Number(novo_valor_kg);
            const status_entrega_string = String(status_entrega);
            const entrega_urgente_bool = Boolean(nova_entrega_urgente);

            if (!nova_data || nova_entrega_urgente === undefined || nova_entrega_urgente === null || !nova_distancia || !novo_peso || !novo_valor_km || !novo_valor_kg || !novo_id_cliente || !novo_status_entrega || typeof status_entrega_string !== "string" || !Number.isInteger(id_cliente_num) || typeof entrega_urgente_bool !== "boolean" || typeof distancia_num !== "number" || typeof peso_num !== "number" || typeof valor_km_num !== "number" || typeof valor_kg_num !== "number" || distancia_num <= 0 || peso_num <= 0) {
                return res.status(400).json({ message: "Você inseriu os valores de maneira inadequada." });
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

   /**
 * @async
 * @function deletarPedido
 * @description Controlador responsável por excluir um pedido e sua entrega relacionada
 * a partir do identificador fornecido na URL. Antes da exclusão, a função valida o ID
 * e verifica se o pedido realmente existe no banco de dados.
 * 
 * @param {Object} req Objeto de requisição do Express.
 * @param {string} req.params.id Identificador do pedido que deve ser removido.
 * @param {Object} res Objeto de resposta do Express.
 * 
 * @returns {JSON} Retorna uma resposta JSON contendo mensagens de sucesso,
 * erro de validação ou erro de inexistência, além dos resultados da operação
 * de exclusão quando bem-sucedida.
 * 
 * @example
 * // Requisição válida:
 * DELETE /pedidos/10
 * 
 * // Resposta esperada:
 * {
 *   "message": "Pedido e entrega deletados com sucesso!",
 *   "resultado": { ... }
 * }
 * 
 * @example
 * // ID inválido:
 * DELETE /pedidos/abc
 * 
 * // Resposta:
 * {
 *   "message": "Insira um id válido"
 * }
 * 
 * @example
 * // Pedido inexistente:
 * DELETE /pedidos/9999
 * 
 * // Resposta:
 * {
 *   "message": "Pedido não encontrado"
 * }
 */
    deletarPedido: async (req, res) => {

        try {
            const id = req.params.id;
            const id_num = Number(id);

            if (!id || !Number.isInteger(id_num)) {
                return res.status(400).json({ message: "Insira um id válido" });
            }

            const pedidoSelecionado = await pedidoModel.buscarPedidoPorId(id);

            if (pedidoSelecionado.length === 0) {
                return res.status(404).json({ Message: "Pedido não encontrado" });
            }

            const resultado = await pedidoModel.deletePedido(id);

            return res.status(200).json({ message: "Pedido e entrega deletados com sucesso!", resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao deletar o pedido e a entrega'
            });
        }

    }


}

module.exports = { pedidoController }