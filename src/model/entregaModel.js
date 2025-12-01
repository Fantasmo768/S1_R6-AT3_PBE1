const pool = require('../config/db');

const entregaModel = {

        /**
     * @async
     * @function buscarTodasEntregas
     * Seleciona todas as entregas cadastradas na tabela "entregas"
     * @returns {Promise<Array<Object>>} Retorna um array contendo todos os registros da tabela de entregas
     * 
     * @example
     * const entregas = await entregaModel.buscarTodasEntregas();
     * console.log(entregas);
     * // Resultado esperado:
     * // [
     * //   {
     * //     id_entrega: 1,
     * //     id_pedido: 10,
     * //     endereco_entrega: "Rua A, 123",
     * //     status: "Em trânsito",
     * //     data_entrega: "2025-02-10"
     * //   },
     * //   {
     * //     id_entrega: 2,
     * //     id_pedido: 12,
     * //     endereco_entrega: "Rua B, 55",
     * //     status: "Entregue",
     * //     data_entrega: "2025-02-11"
     * //   }
     * // ]
     */

    buscarTodasEntregas: async () => {
        const connection = await pool.getConnection();

        try {
            const sqlSelect = 'SELECT * FROM entregas;';
            const [rowsSelect] = await connection.query(sqlSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

        /**
     * @async
     * @function buscarEntregaPorId
     * Seleciona uma entrega específica de acordo com o id_entrega informado
     * @param {Number} id_entrega Identificador da entrega que deve ser pesquisada no banco de dados
     * @returns {Promise<Array<Object>>} Retorna um array contendo o registro correspondente ao ID informado
     * 
     * @example
     * const entrega = await entregaModel.buscarEntregaPorId(3);
     * console.log(entrega);
     * // Resultado esperado:
     * // [
     * //   {
     * //     id_entrega: 3,
     * //     id_pedido: 15,
     * //     endereco_entrega: "Rua Central, 88",
     * //     status: "A caminho",
     * //     data_entrega: "2025-02-12"
     * //   }
     * // ]
     */

    buscarEntregaPorId: async (id_entrega) => {
        const connection = await pool.getConnection();

        try {
            const sqlSelect = 'SELECT * FROM entregas WHERE id_entrega = ?;';
            const valuesSelect = [id_entrega];
            const [rowsSelect] = await connection.query(sqlSelect, valuesSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

        /**
     * @async
     * @function insertEntrega
     * Insere uma nova entrega na tabela "entregas" com base nos dados fornecidos
     * @param {Number} valor_distancia Valor calculado pela distância percorrida
     * @param {Number} valor_peso Valor calculado pelo peso transportado
     * @param {Number} acrescimo Valor adicional aplicado à entrega (se houver)
     * @param {Number} desconto Valor de desconto aplicado (se houver)
     * @param {Number} taxa Valor da taxa aplicada ao serviço de entrega
     * @param {Number} valor_final Valor final total da entrega
     * @param {String} status_entrega Status atual da entrega (ex: "pendente", "em trânsito", "entregue")
     * @param {Number} id_pedido Identificador do pedido relacionado à entrega (id_pedido_fk)
     * @returns {Promise<Object>} Retorna o resultado da operação de inserção, incluindo o ID gerado
     * 
     * @example
     * const entrega = await entregaModel.insertEntrega(
     *   15.50,   // valor_distancia
     *   8.20,    // valor_peso
     *   5.00,    // acrescimo
     *   0.00,    // desconto
     *   2.50,    // taxa
     *   31.20,   // valor_final
     *   "pendente",
     *   12       // id_pedido
     * );
     * 
     * console.log(entrega);
     * // Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   insertId: 50,
     * //   warningStatus: 0
     * // }
     */

    insertEntrega: async (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido) => {
        const connection = await pool.getConnection();
        try {
            const sqlInsert = 'INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
            const valuesInsert = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido];
            const [rowsInsert] = await connection.query(sqlInsert, valuesInsert);

            connection.commit();

            return rowsInsert;

        } catch (error) {
            connection.rollback();
        }
    },

        /**
     * @async
     * @function updateEntrega
     * Atualiza os dados de uma entrega existente na tabela "entregas" com base no id_entrega informado
     * @param {Number} valor_distancia Novo valor referente à distância percorrida
     * @param {Number} valor_peso Novo valor referente ao peso da carga
     * @param {Number} acrescimo Valor adicional atualizado da entrega (se houver)
     * @param {Number} desconto Valor de desconto atualizado da entrega (se houver)
     * @param {Number} taxa Nova taxa aplicada ao serviço de entrega
     * @param {Number} valor_final Novo valor final total da entrega
     * @param {String} status_entrega Novo status da entrega ("pendente", "em trânsito", "entregue", etc.)
     * @param {Number} id_pedido Identificador atualizado do pedido vinculado à entrega
     * @param {Number} id_entrega Identificador da entrega que deve ser atualizada
     * @returns {Promise<Object>} Retorna o resultado da operação de atualização, incluindo quantidade de linhas afetadas
     * 
     * @example
     * const resultado = await entregaModel.updateEntrega(
     *   12.30,    // valor_distancia
     *   6.10,     // valor_peso
     *   3.00,     // acrescimo
     *   1.00,     // desconto
     *   2.50,     // taxa
     *   22.90,    // valor_final
     *   "em trânsito",
     *   10,       // id_pedido
     *   5         // id_entrega
     * );
     * 
     * console.log(resultado);
     * // Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   changedRows: 1,
     * //   warningStatus: 0
     * // }
     */

    updateEntrega: async (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido, id_entrega) => {
        const connection = await pool.getConnection();
        try {
            const sqlInsert = 'UPDATE entregas SET valor_distancia = ?, valor_peso = ?, acrescimo = ?, desconto = ?, taxa = ?, valor_final = ?, status_entrega = ?, id_pedido_fk = ? WHERE id_entrega = ?;';
            const valuesInsert = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido, id_entrega];
            const [rowsInsert] = await connection.query(sqlInsert, valuesInsert);

            connection.commit();

            return rowsInsert;

        } catch (error) {
            connection.rollback();
        }
    },

        /**
     * @async
     * @function deleteEntrega
     * Remove uma entrega da tabela "entregas" com base no id_entrega informado
     * @param {Number} id_entrega Identificador da entrega que deve ser excluída do banco de dados
     * @returns {Promise<Object>} Retorna o resultado da operação de exclusão, incluindo a quantidade de linhas afetadas
     * 
     * @example
     * const resultado = await entregaModel.deleteEntrega(7);
     * console.log(resultado);
     * // Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   warningStatus: 0
     * // }
     */

    deleteEntrega: async (id_entrega) => {
        const connection = await pool.getConnection();
        try {

            const sql = 'DELETE FROM entregas WHERE id_entrega = ?;'
            const [rows] = await pool.query(sql, id_entrega);

            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }

}

module.exports = { entregaModel }