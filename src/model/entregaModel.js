const pool = require('../config/db');

const entregaModel = {

    buscarTodasEntregas: async () => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();
            const sqlSelect = 'SELECT * FROM entregas;';
            const [rowsSelect] = await connection.query(sqlSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

    buscarEntregaPorId: async (id_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const sqlSelect = 'SELECT * FROM entregas WHERE id_entregas = ?;';
            const valuesSelect = [id_entrega];
            const [rowsSelect] = await connection.query(sqlSelect, valuesSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    insertEntrega: async (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlInsert = 'INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
            const valuesInsert = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido];
            const [rowsInsert] = await connection.query(sqlInsert, valuesInsert);

            connection.commit();

            return rowsInsert;

        } catch (error) {
            connection.rollback();
        }
    },

    updateEntrega: async (valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido, id_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlInsert = 'UPDATE entregas SET valor_distancia = ?, valor_peso = ?, acrescimo = ?, desconto = ?, taxa = ?, valor_final = ?, status_entrega = ?, id_pedido_fk = ? WHERE id_entregas = ?;';
            const valuesInsert = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido, id_entrega];
            const [rowsInsert] = await connection.query(sqlInsert, valuesInsert);

            connection.commit();

            return rowsInsert;

        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    deleteEntrega: async (id_entrega) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = 'DELETE FROM entregas WHERE id_entregas = ?;'
            const [rows] = await pool.query(sql, id_entrega);

            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    buscarEntregaPorPedido: async (id_pedido) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sql = "SELECT * FROM entregas WHERE id_pedido_fk = ?";
            const [rows] = await pool.query(sql, [id_pedido]);

            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }
}

module.exports = { entregaModel }