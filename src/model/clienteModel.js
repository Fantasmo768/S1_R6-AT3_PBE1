const pool = require('../config/db');

const clienteModel = {
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM cliente;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    inserirCliente: async (nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade) => {
        const sql = `
            INSERT INTO clientes 
            (nome, sobrenome, cpf, telefone, email, logradouro, numero, bairro, estado, cep, cidade)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep];

        const [rows] = await pool.query(sql, values);
        return rows;
    },
    buscarPorId: async (id_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?;';
        const values = [id_cliente];

        const [rows] = await pool.query(sql, values);
        return rows;
    },
    buscarPorCpf: async (cpf_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?;'
        const values = [cpf_cliente];

        const [rows] = await pool.query(sql, values);
        return rows;
    }

};

module.exports = { clienteModel };
