const pool = require('../config/db');

const entregaModel = {
    insertEntrega: async (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido) => {
        const connection = await pool.getConnection();
        try {
            const sqlInsert = 'INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
            const valuesInsert = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido];
            const [rowsInsert] = await connection.query(sqlInsert, valuesInsert);

            connection.commit();

            return rowsInsert

        } catch (error) {
            connection.rollback();
        }
    }

}

module.exports = { entregaModel }