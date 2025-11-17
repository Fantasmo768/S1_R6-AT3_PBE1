const pool = require('../config/db');

const clienteModel = {
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM cliente;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    inserirCliente: async ( nome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado,cep) => {
        const sql = `
            INSERT INTO cliente 
            (nome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [ nome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado,cep ];

        const [rows] = await pool.query(sql, values);
        return rows;
    }
};

module.exports = { clienteModel };
