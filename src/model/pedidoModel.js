const pool = require('../config/db');

const pedidoModel = {

        /**
     * @async
     * @function buscarTodosPedidos
     * Seleciona todos os registros da tabela "pedidos"
     * @returns {Promise<Array<Object>>} Retorna um array contendo todos os pedidos cadastrados no banco de dados
     * 
     * @example
     * const pedidos = await pedidoModel.buscarTodosPedidos();
     * console.log(pedidos);
     * // Resultado esperado:
     * // [
     * //   {
     * //     id_pedido: 1,
     * //     id_cliente_fk: 3,
     * //     data_pedido: "2025-02-15",
     * //     valor_total: 89.90,
     * //     status_pedido: "Finalizado"
     * //   },
     * //   {
     * //     id_pedido: 2,
     * //     id_cliente_fk: 1,
     * //     data_pedido: "2025-02-16",
     * //     valor_total: 120.50,
     * //     status_pedido: "Em andamento"
     * //   }
     * // ]
     */

    buscarTodosPedidos: async () => {
        const connection = await pool.getConnection();

        try {

            await connection.beginTransaction();

            const sqlSelect = 'SELECT * FROM pedidos;';
            const [rowsSelect] = await connection.query(sqlSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

    /**
 * @async
 * @function buscarPedidoPorId
 * Busca um pedido específico no banco de dados pelo seu identificador (id_pedido).
 *
 * @param {Number} id_pedido Identificador do pedido que deve ser pesquisado no banco de dados.
 * @returns {Promise<Array<Object>>} Retorna um array contendo o objeto do pedido correspondente ao ID informado.
 *
 * @example
 * const pedido = await pedidoModel.buscarPedidoPorId(5);
 * console.log(pedido);
 * // Resultado esperado:
 * // [{ id_pedido: 5, data_pedido: "2024-10-20", valor_total: 250.00, status_pedido: "concluído" }]
 */

    buscarPedidoPorId: async (id_pedido) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const sqlSelect = 'SELECT * FROM pedidos WHERE id_pedido = ?;';
            const valuesSelect = [id_pedido];
            const [rowsSelect] = await connection.query(sqlSelect, valuesSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

    /**
 * @async
 * @function buscarInfoPedido
 * Busca informações específicas de um pedido no banco de dados, com base no id_pedido informado.
 *
 * @param {Number} id_pedido Identificador do pedido que deve ser pesquisado no banco de dados.
 * @returns {Promise<Array<Object>>} Retorna um array contendo as informações do pedido, incluindo
 * distância, peso, valor_km, valor_kg e se a entrega é urgente.
 *
 * @example
 * const info = await pedidoModel.buscarInfoPedido(3);
 * console.log(info);
 * // Resultado esperado:
 * // [{
 * //   distancia: 12.5,
 * //   peso: 8.2,
 * //   valor_km: 1.50,
 * //   valor_kg: 2.00,
 * //   entrega_urgente: 0
 * // }]
 */

    buscarInfoPedido: async (id_pedido) => {
        const connection = await pool.getConnection();

        try {
            const sqlSelect = 'SELECT distancia, peso, valor_km, valor_kg, entrega_urgente FROM pedidos WHERE id_pedido = ?;';
            const valuesSelect = [id_pedido];
            const [rowsSelect] = await connection.query(sqlSelect, valuesSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }

    },

     /**
 * @async
 * @function adicionarPedido
 * Cria um novo pedido no banco de dados e, em seguida, insere automaticamente a entrega
 * vinculada ao pedido recém-criado.
 *
 * @param {String} data_pedido Data em que o pedido foi realizado.
 * @param {Number} entrega_urgente Indica se o pedido é urgente (0 = não, 1 = sim).
 * @param {Number} distancia Distância total da entrega em quilômetros.
 * @param {Number} peso Peso total da carga em quilogramas.
 * @param {Number} valor_km Valor cobrado por quilômetro.
 * @param {Number} valor_kg Valor cobrado por quilograma.
 * @param {Number} id_cliente Identificador do cliente que realizou o pedido.
 * @param {Number} valor_distancia Valor calculado com base na distância.
 * @param {Number} valor_peso Valor calculado com base no peso.
 * @param {Number} acrescimo Valor adicional aplicado à entrega (ex.: urgência).
 * @param {Number} desconto Valor descontado da entrega.
 * @param {Number} taxa Taxa fixa aplicada ao pedido.
 * @param {Number} valor_final Valor final total da entrega.
 * @param {String} status_entrega Status atual da entrega (ex.: "pendente", "concluída").
 *
 * @returns {Promise<Object>} Retorna um objeto contendo o resultado da inserção do pedido
 * e da entrega vinculada.
 *
 * @example
 * const resultado = await pedidoModel.adicionarPedido(
 *   "2025-01-10",
 *   1,
 *   15.2,
 *   12.5,
 *   1.50,
 *   2.00,
 *   4,         // id do cliente
 *   22.8,
 *   25.0,
 *   10.0,
 *   5.0,
 *   8.0,
 *   60.8,
 *   "pendente"
 * );
 *
 * console.log(resultado);
 * // Resultado esperado:
 * // {
 * //   rowsPedido: { insertId: 10, ... },
 * //   rowsEntrega: { insertId: 10, ... }
 * // }
 */

    adicionarPedido: async (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const sqlPedido = 'INSERT INTO pedidos (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente_fk) VALUES (?, ?, ?, ?, ?, ?, ?);';
            const values = [data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente];
            const [rowsPedido] = await connection.query(sqlPedido, values);

            const sqlEntrega = 'INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
            const valuesEntrega = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, rowsPedido.insertId];
            const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

            connection.commit();
            return { rowsPedido, rowsEntrega };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    /**
 * @async
 * @function atualizarPedido
 * Atualiza as informações de um pedido existente no banco de dados e atualiza
 * também os dados da entrega vinculada ao mesmo pedido.
 *
 * @param {String} data_pedido Data atualizada do pedido.
 * @param {Number} entrega_urgente Indica se o pedido é urgente (0 = não, 1 = sim).
 * @param {Number} distancia Distância total da entrega em quilômetros.
 * @param {Number} peso Peso total da carga em quilogramas.
 * @param {Number} valor_km Valor cobrado por quilômetro.
 * @param {Number} valor_kg Valor cobrado por quilograma.
 * @param {Number} id_cliente Identificador do cliente responsável pelo pedido.
 * @param {Number} id_pedido Identificador do pedido que será atualizado.
 * @param {Number} valor_distancia Valor calculado com base na distância.
 * @param {Number} valor_peso Valor calculado com base no peso.
 * @param {Number} acrescimo Valor adicional aplicado à entrega.
 * @param {Number} desconto Valor descontado da entrega.
 * @param {Number} taxa Taxa fixa aplicada ao pedido.
 * @param {Number} valor_final Valor total final da entrega.
 * @param {String} status_entrega Status atual da entrega.
 *
 * @returns {Promise<Object>} Retorna um objeto contendo o resultado da atualização
 * do pedido e da entrega vinculada.
 *
 * @example
 * const resultado = await pedidoModel.atualizarPedido(
 *   "2025-01-12",
 *   0,
 *   22.0,
 *   18.3,
 *   1.50,
 *   2.00,
 *   4,       // ID do cliente
 *   10,      // ID do pedido
 *   33.0,
 *   36.6,
 *   5.0,
 *   0.0,
 *   8.0,
 *   82.6,
 *   "em transporte"
 * );
 *
 * console.log(resultado);
 * // Resultado esperado:
 * // {
 * //   rowsPedido: { affectedRows: 1, ... },
 * //   rowsEntrega: { affectedRows: 1, ... }
 * // }
 */

    atualizarPedido: async (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, id_pedido, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const sqlPedido = 'UPDATE pedidos SET data_pedido = ?, entrega_urgente = ?, distancia = ?, peso = ?, valor_km = ?, valor_kg = ?, id_cliente_fk = ? WHERE id_pedido = ?;';
            const values = [data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, id_pedido];
            const [rowsPedido] = await connection.query(sqlPedido, values);

            const sqlEntrega = 'UPDATE entregas SET valor_distancia = ?, valor_peso = ?, acrescimo = ?, desconto = ?, taxa = ?, valor_final = ?, status_entrega = ? WHERE id_pedido_fk = ?;';
            const valuesEntrega = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido];
            const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

            connection.commit();
            return { rowsPedido, rowsEntrega };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    /**
 * @async
 * @function deletePedido
 * Remove um pedido do banco de dados com base no seu identificador.
 *
 * @param {Number} id_pedido Identificador do pedido que deve ser removido.
 *
 * @returns {Promise<Object>} Retorna o resultado da operação de remoção,
 * incluindo quantidade de linhas afetadas.
 *
 * @example
 * const resultado = await pedidoModel.deletePedido(5);
 * console.log(resultado);
 * // Resultado esperado:
 * // { affectedRows: 1, ... }
 */

    deletePedido: async (id_pedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;'
            const [rows] = await pool.query(sql, id_pedido);

            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    buscarPedidosPorCliente: async (id_cliente) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = "SELECT * FROM pedidos WHERE id_cliente_fk = ?";
            const [rows] = await pool.query(sql, [id_cliente]);

             connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }

}

module.exports = { pedidoModel }