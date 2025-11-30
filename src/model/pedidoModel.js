const pool = require('../config/db');

const pedidoModel = {

    buscarTodosPedidos: async () => {
        const connection = await pool.getConnection();

        try {
            const sqlSelect = 'SELECT * FROM pedidos;';
            const [rowsSelect] = await connection.query(sqlSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

    buscarPedidoPorId: async (id_pedido) => {
        const connection = await pool.getConnection();

        try {
            const sqlSelect = 'SELECT * FROM pedidos WHERE id_pedido = ?;';
            const valuesSelect = [id_pedido];
            const [rowsSelect] = await connection.query(sqlSelect, valuesSelect);

            connection.commit();

            return rowsSelect;
        } catch (error) {
            connection.rollback();
        }
    },

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

    adicionarPedido: async (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
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

    atualizarPedido: async (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, id_pedido, valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega) => {
        const connection = await pool.getConnection();
        try {
            const sqlPedido = 'UPDATE pedidos SET data_pedido = ?, entrega_urgente = ?, distancia = ?, peso = ?, valor_km = ?, valor_kg = ?, id_cliente_fk = ? WHERE id_pedido = ?;';
            const values = [data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, id_pedido];
            const [rowsPedido] = await connection.query(sqlPedido, values);

            const sqlEntrega = 'UPDATE entregas SET valor_distancia = ?, valor_peso = ?, acrescimo = ?, desconto = ?, taxa = ?, valor_final = ?, status_entrega = ? HHERE id_pedido_fk = ?;';
            const valuesEntrega = [valor_distancia, valor_peso, acrescimo, desconto, taxa, valor_final, status_entrega, id_pedido];
            const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

            connection.commit();
            return { rowsPedido, rowsEntrega };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    deletePedido: async (id_pedido) => {
        const connection = await pool.getConnection();
        try {

            const sql = 'DELETE FROM pedidos WHERE id_pedido = ?;'
            const [rows] = await pool.query(sql, id_pedido);

            connection.commit();
            return rows;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }

}

module.exports = { pedidoModel }