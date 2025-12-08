const { pedidoModel } = require("../model/pedidoModel");
const { entregaModel } = require("../model/entregaModel");

const entregaController = {

    /**
 * @async
 * @function buscarTodos
 * Busca todas as entregas cadastradas no banco de dados.
 *
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP usado para enviar os dados ou erros.
 *
 * @returns {Promise<Object>} Retorna um array contendo todas as entregas cadastradas.
 * Caso não exista nenhuma entrega, retorna uma mensagem informando isso.
 *
 * @throws {500} Se ocorrer algum erro ao buscar as entregas no banco de dados.
 *
 * @example
 * // Requisição GET:
 * // GET /entregas
 *
 * // Resposta esperada:
 * [
 *   {
 *     "id_entrega": 1,
 *     "id_cliente": 3,
 *     "status": "Em transporte",
 *     "data_envio": "2024-05-10",
 *     "data_entrega": null
 *   },
 *   {
 *     "id_entrega": 2,
 *     "id_cliente": 1,
 *     "status": "Entregue",
 *     "data_envio": "2024-04-22",
 *     "data_entrega": "2024-04-30"
 *   }
 * ]
 */

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

    /**
 * @async
 * @function buscarPorId
 * Busca uma entrega específica pelo identificador informado nos parâmetros da requisição.
 *
 * @param {Object} req Objeto de requisição HTTP contendo o parâmetro `id_entrega`.
 * @param {Object} res Objeto de resposta HTTP usado para retornar o resultado ou mensagens de erro.
 *
 * @returns {Promise<Object>} Retorna o objeto da entrega correspondente ao ID informado.
 * Caso o ID seja inválido ou a entrega não exista, retorna uma mensagem apropriada.
 *
 * @throws {400} Caso o ID informado não seja válido.
 * @throws {404} Caso nenhuma entrega seja encontrada com o ID especificado.
 * @throws {500} Caso ocorra algum erro interno ao buscar a entrega.
 *
 * @example
 * // Requisição GET:
 * // GET /entregas/5
 *
 * // Resposta esperada:
 * {
 *   "message": "entrega:",
 *   "resultado": [
 *     {
 *       "id_entrega": 5,
 *       "id_cliente": 2,
 *       "status": "Entregue",
 *       "data_envio": "2024-05-01",
 *       "data_entrega": "2024-05-05"
 *     }
 *   ]
 * }
 */

    buscarPorId: async (req, res) => {
        try {
            const { id_entrega } = req.params;

            const id_entrega_num = Number(id_entrega);

            if (!id_entrega_num || !Number.isInteger(id_entrega_num)) {
                return res.status(400).json({ message: "Insira um ID válido" });
            }

            const resultado = await entregaModel.buscarEntregaPorId(id_entrega_num);

            if (resultado.length === 0) {
                return res.status(404).json({ message: "Pedido não encontrado" });
            }

            return res.status(200).json({ message: "Pedido:", resultado })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar a entrega'
            });
        }
    },

    /**
 * @async
 * @function adicionarEntrega
 * Adiciona uma nova entrega com base nos dados enviados no corpo da requisição
 * e nas informações calculadas do pedido associado.
 *
 * @param {Object} req Objeto de requisição HTTP contendo `status_entrega` e `id_pedido` no corpo.
 * @param {Object} res Objeto de resposta HTTP usado para retornar mensagens e os dados inseridos.
 *
 * @returns {Promise<Object>} Retorna a confirmação da criação da entrega junto dos dados inseridos.
 *
 * @throws {400} Caso algum valor obrigatório seja inválido, ausente ou com formato inadequado.
 * @throws {404} Caso o pedido informado não exista (tratado no model, se aplicável).
 * @throws {500} Caso ocorra um erro inesperado no servidor.
 *
 * @description
 * A função também realiza os seguintes cálculos automaticamente com base nos dados do pedido:
 *  - **valor_distancia** = distância × valor_km  
 *  - **valor_peso** = peso × valor_kg  
 *  - **acréscimo** de 20% se a entrega for urgente  
 *  - **desconto** de 10% se o valor final ultrapassar R$ 500  
 *  - **taxa fixa** caso o peso ultrapasse 50 kg  
 *  - **valor_final** resultante após acréscimos, descontos e taxas
 *
 * @example
 * // POST /entregas
 * {
 *   "status_entrega": "calculado",
 *   "id_pedido": 12
 * }
 *
 * // Resposta esperada:
 * {
 *   "message": "Entrega adicionada com sucesso",
 *   "resultado": {
 *      "id_entrega": 34,
 *      "valor_distancia": 150,
 *      "valor_peso": 80,
 *      "acrescimo": 46,
 *      "desconto": 0,
 *      "taxa": false,
 *      "valor_final": 276,
 *      "status_entrega": "calculado",
 *      "id_pedido_fk": 12
 *   }
 * }
 */

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

            const pedidoRelacionado = await entregaModel.buscarEntregaPorPedido(id_pedido);
            
            if (pedidoRelacionado.length !== 0) {
                return res.status(400).json({message: "Já existe uma entrega relacionada a este pedido!"});
            }

            const pedidoSelecionado = await pedidoModel.buscarInfoPedido(id_pedido);

            const { distancia, peso, valor_km, valor_kg, entrega_urgente } = pedidoSelecionado[0];

            const distancia_num = Number(distancia);
            const peso_num = Number(peso);
            const valor_km_num = Number(valor_km);
            const valor_kg_num = Number(valor_kg);
            const entrega_urgente_bool = Boolean(entrega_urgente)

            //#region Cálculo da entrega

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = distancia_num * valor_km_num;

            let valor_peso = peso_num * valor_kg_num;

            let valor_base = valor_distancia + valor_peso;

            let valor_final = valor_base;

            if (peso_num > 50) {
                taxa = true;
            }

            if (entrega_urgente_bool === true) {
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
            //#endregion

            const resultado = await entregaModel.insertEntrega(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido);

            return res.status(201).json({ message: "Entrega adicionada com sucesso", resultado })

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }


    },

    /**
 * @async
 * @function atualizarEntrega
 * Atualiza uma entrega existente no banco de dados,
 * recalculando automaticamente todos os valores relacionados ao pedido.
 *
 * @param {Object} req Objeto de requisição HTTP contendo:
 *  - `id_entrega` nos parâmetros da URL
 *  - `status_entrega` e `id_pedido` no corpo da requisição
 *
 * @param {Object} res Objeto de resposta HTTP usado para retornar os resultados e mensagens.
 *
 * @returns {Promise<Object>} Retorna a confirmação da atualização e os dados processados.
 *
 * @throws {400} Caso o ID seja inválido ou fora do formato correto.
 * @throws {405} Caso qualquer dado obrigatório seja inserido de forma inadequada.
 * @throws {404} Caso a entrega/pedido não exista (dependendo de validação no model).
 * @throws {500} Caso ocorra algum erro inesperado no servidor.
 *
 * @description
 * A função recalcula automaticamente todos os campos relacionados ao custo da entrega:
 *
 *  - **valor_distancia** = distância × valor_km  
 *  - **valor_peso** = peso × valor_kg  
 *  - **acréscimo** de 20% se a entrega for urgente  
 *  - **desconto** de 10% se o valor final ultrapassar R$ 500  
 *  - **taxa fixa** caso o peso ultrapasse 50 kg  
 *  - **valor_final** = valor_base + acréscimos − descontos + taxa  
 *
 * Também permite atualização parcial: caso algum campo não seja enviado,
 * o valor atual da entrega será mantido.
 *
 * @example
 * // PUT /entregas/10
 * {
 *   "status_entrega": "em transito",
 *   "id_pedido": 3
 * }
 *
 * // Resposta esperada:
 * {
 *   "message": "Pedido atualizado com sucesso",
 *   "resultado": {
 *      "id_entrega": 10,
 *      "valor_distancia": 120,
 *      "valor_peso": 40,
 *      "acrescimo": 24,
 *      "desconto": 0,
 *      "taxa": false,
 *      "valor_final": 184,
 *      "status_entrega": "em transito",
 *      "id_pedido_fk": 3
 *   }
 * }
 */

    atualizarEntrega: async (req, res) => {
        try {
            const { id_entrega} = req.params;
            const { status_entrega, id_pedido } = req.body;

            const id_entrega_num = Number(id_entrega);

            if (!id_entrega || !Number.isInteger(id_entrega_num)) {
                return res.status(400).json({ message: "Insira um id válido." })
            }

             const entrega_atual = await entregaModel.buscarEntregaPorId(id_entrega);

            const novo_status_entrega = status_entrega ?? entrega_atual[0].status_entrega;
            const novo_id_pedido = id_pedido ?? entrega_atual[0].id_pedido_fk;

            const novo_id_pedido_num = Number(novo_id_pedido);

            const pedidoSelecionado = await pedidoModel.buscarInfoPedido(novo_id_pedido);

            const { distancia, peso, valor_km, valor_kg, entrega_urgente } = pedidoSelecionado[0];

            const distancia_num = Number(distancia);
            const peso_num = Number(peso);
            const valor_km_num = Number(valor_km);
            const valor_kg_num = Number(valor_kg);
            const entrega_urgente_bool = Boolean(entrega_urgente);

            if (!novo_status_entrega || !novo_id_pedido || !Number.isInteger(novo_id_pedido_num)) {
                return res.status(405).json({ message: "Você inseriu os valores de maneira inadequada." });
            }

            if (novo_status_entrega !== "calculado" && novo_status_entrega !== "entregue" && novo_status_entrega !== "em transito" && novo_status_entrega !== "cancelado") {
                return res.status(400).json({ message: "Insira algum status de entrega que esteja de acordo com a lista: calculado, entrege, em transito ou cancelado" });
            }

            const pedidoRelacionado = await entregaModel.buscarEntregaPorPedido(id_pedido);
            
            if (pedidoRelacionado.length !== 0) {
                return res.status(400).json({message: "Já existe uma entrega relacionada a este pedido!"});
            }

            let desconto = 0;

            let acrescimo = 0;

            let taxa = false;

            let valor_distancia = distancia_num * valor_km_num;

            let valor_peso = peso_num * valor_kg_num;

            let valor_base = valor_distancia + valor_peso;

            let valor_final = valor_base;

            if (peso_num > 50) {
                taxa = true;
            }

            if (entrega_urgente_bool === true) {
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
            
            const resultado = await entregaModel.updateEntrega(valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, novo_status_entrega, novo_id_pedido, id_entrega);


            console.log(resultado, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, novo_status_entrega, novo_id_pedido, id_entrega)

            return res.status(201).json({ message: "Entrega atualizada com sucesso", resultado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    },

    /**
 * @async
 * @function deletarEntrega
 * Deleta uma entrega específica do banco de dados de acordo com o ID informado.
 *
 * @param {Object} req Objeto de requisição HTTP contendo:
 *  - `params.id` → ID da entrega a ser deletada.
 *
 * @param {Object} res Objeto de resposta HTTP usado para enviar a resposta ao cliente.
 *
 * @returns {Promise<Object>} Retorna uma mensagem de sucesso e o resultado da remoção no banco.
 *
 * @throws {400} Caso o ID não seja válido.
 * @throws {404} Caso a entrega não seja encontrada.
 * @throws {500} Caso ocorra algum erro inesperado no servidor.
 *
 * @example
 * // DELETE /entregas/3
 * const resposta = await entregaController.deletarEntrega(req, res);
 *
 * // Resultado esperado
 * {
 *   "message": "Entrega deletada com sucesso!",
 *   "resultado": { "affectedRows": 1 }
 * }
 */
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

            const resultado = await entregaModel.deleteEntrega(id);

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