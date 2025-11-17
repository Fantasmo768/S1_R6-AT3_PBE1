const pool = require('../config/db');

const pedidoModel = {


    adicionarPedido: async (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente) => {
        const connection = await pool.getConnection();
        try {
            const sqlPedido = 'INSERT INTO pedidos (data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente_fk) VALUES (?, ?, ?, ?, ?, ?, ?);';
            const values = [data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente];
            const [rowsPedido] = await connection.query(sqlPedido, values);

            connection.commit();
            return rowsPedido;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    }

}

module.exports = {pedidoModel}