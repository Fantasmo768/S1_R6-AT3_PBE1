const pool = require('../config/db');

const clienteModel = {
        /**
     * @async
     * @function selecionarTodos
     * Seleciona todos os clientes cadastrados na tabela "clientes"
     * @returns {Promise<Array<Object>>} Retorna um array contendo todos os objetos presentes na tabela de clientes
     * 
     * @example
     * const clientes = await clienteModel.selecionarTodos();
     * console.log(clientes);
     * //Resultado esperado
     * [
     *   { id_cliente: 1, nome: "João Silva", cpf: "12345678900", telefone: "11999999999", email: "joao@email.com", ... },
     *   { id_cliente: 2, nome: "Maria Souza", cpf: "98765432100", telefone: "11988888888", email: "maria@email.com", ... }
     * ]
     */
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

        /**
     * @async
     * @function inserirCliente
     * Insere um novo cliente na tabela "clientes" de acordo com os dados fornecidos
     * @param {String} nome_cliente Nome do cliente
     * @param {String} sobrenome_cliente Sobrenome do cliente
     * @param {String} cpf_cliente CPF do cliente
     * @param {String|Number} telefone Telefone de contato do cliente
     * @param {String} email Endereço de e-mail do cliente
     * @param {String} logradouro Nome da rua/avenida do endereço do cliente
     * @param {String|Number} numero Número da residência do cliente
     * @param {String} bairro Bairro onde o cliente reside
     * @param {String} estado Estado onde o cliente reside
     * @param {String|Number} cep Código postal do endereço do cliente
     * @param {String} cidade Cidade onde o cliente reside
     * @returns {Promise<Object>} Retorna o resultado da operação de inserção, incluindo o ID gerado
     * 
     * @example
     * const novoCliente = await clienteModel.inserirCliente(
     *   "João",
     *   "Silva",
     *   "12345678900",
     *   "11999999999",
     *   "joao@email.com",
     *   "Rua das Flores",
     *   123,
     *   "Centro",
     *   "SP",
     *   "01001000",
     *   "São Paulo"
     * );
     * 
     * console.log(novoCliente);
     * //Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   insertId: 45,
     * //   warningStatus: 0
     * // }
     */
    inserirCliente: async (nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade) => {
        const sql = `
            INSERT INTO clientes 
            (nome, sobrenome, cpf, telefone, email, logradouro, numero, bairro, estado, cep, cidade)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        const values = [nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

        /**
     * @async
     * @function buscarPorId
     * Seleciona um cliente de acordo com o id_cliente especificado
     * @param {Number} id_cliente Identificador do cliente que deve ser pesquisado no banco de dados
     * @returns {Promise<Array<Object>>} Retorna um array contendo o cliente correspondente ao ID informado
     * 
     * @example
     * const cliente = await clienteModel.buscarPorId(1);
     * console.log(cliente);
     * //Resultado esperado:
     * // [
     * //   {
     * //     id_cliente: 1,
     * //     nome: "João",
     * //     sobrenome: "Silva",
     * //     cpf: "12345678900",
     * //     telefone: "11999999999",
     * //     email: "joao@email.com",
     * //     logradouro: "Rua A",
     * //     numero: 100,
     * //     bairro: "Centro",
     * //     estado: "SP",
     * //     cep: "01001000",
     * //     cidade: "São Paulo"
     * //   }
     * // ]
     */

    buscarPorId: async (id_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?;';
        const values = [id_cliente];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

        /**
     * @async
     * @function buscarPorCpf
     * Seleciona um cliente de acordo com o CPF informado
     * @param {String} cpf_cliente CPF do cliente que deve ser pesquisado no banco de dados
     * @returns {Promise<Array<Object>>} Retorna um array contendo o cliente correspondente ao CPF informado
     * 
     * @example
     * const cliente = await clienteModel.buscarPorCpf("12345678900");
     * console.log(cliente);
     * //Resultado esperado:
     * // [
     * //   {
     * //     id_cliente: 1,
     * //     nome: "João",
     * //     sobrenome: "Silva",
     * //     cpf: "12345678900",
     * //     telefone: "11999999999",
     * //     email: "joao@email.com",
     * //     logradouro: "Rua A",
     * //     numero: 100,
     * //     bairro: "Centro",
     * //     estado: "SP",
     * //     cep: "01001000",
     * //     cidade: "São Paulo"
     * //   }
     * // ]
     */

    buscarPorCpf: async (cpf_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?;'
        const values = [cpf_cliente];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

        /**
     * @async
     * @function updateCliente
     * Atualiza os dados de um cliente existente na tabela "clientes" com base no id_cliente informado
     * @param {String} nome_cliente Nome atualizado do cliente
     * @param {String} sobrenome_cliente Sobrenome atualizado do cliente
     * @param {String} cpf_cliente CPF atualizado do cliente
     * @param {String|Number} telefone Telefone atualizado do cliente
     * @param {String} email E-mail atualizado do cliente
     * @param {String} logradouro Logradouro atualizado do endereço do cliente
     * @param {String|Number} numero Número atualizado da residência
     * @param {String} bairro Bairro atualizado do cliente
     * @param {String} estado Estado atualizado do cliente
     * @param {String|Number} cep CEP atualizado do cliente
     * @param {String} cidade Cidade atualizada do cliente
     * @param {Number} id_cliente Identificador do cliente que deve ser atualizado no banco de dados
     * @returns {Promise<Object>} Retorna o resultado da operação de atualização, incluindo quantidade de linhas afetadas
     * 
     * @example
     * const resultado = await clienteModel.updateCliente(
     *   "João",
     *   "Silva",
     *   "12345678900",
     *   "11999999999",
     *   "joao@email.com",
     *   "Rua das Flores",
     *   123,
     *   "Centro",
     *   "SP",
     *   "01001000",
     *   "São Paulo",
     *   1
     * );
     * 
     * console.log(resultado);
     * //Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   changedRows: 1,
     * //   warningStatus: 0
     * // }
     */

    updateCliente: async (nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade, id_cliente) => {
        const sql = 'UPDATE clientes SET nome = ?, sobrenome = ?, cpf = ?, telefone = ?, email = ?, logradouro = ?, numero = ?, bairro = ?, estado = ?, cep = ?, cidade = ? WHERE id_cliente = ?;';
        const values = [nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade, id_cliente];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

        /**
     * @async
     * @function deleteCliente
     * Remove um cliente da tabela "clientes" de acordo com o id_cliente informado
     * @param {Number} id_cliente Identificador do cliente que deve ser removido do banco de dados
     * @returns {Promise<Object>} Retorna o resultado da operação de exclusão, incluindo a quantidade de linhas afetadas
     * 
     * @example
     * const resultado = await clienteModel.deleteCliente(5);
     * console.log(resultado);
     * //Resultado esperado:
     * // {
     * //   affectedRows: 1,
     * //   warningStatus: 0
     * // }
     */

    deleteCliente: async (id_cliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?;'
        const [rows] = await pool.query(sql, id_cliente);
        return rows;
    }

};

module.exports = { clienteModel };
