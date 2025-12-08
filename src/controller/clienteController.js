const { clienteModel } = require('../model/clienteModel');
const { pedidoModel } = require('../model/pedidoModel');
const clienteController = {

    /**
 * @async
 * @function buscarTodos
 * Controlador responsável por buscar todos os clientes cadastrados no banco de dados.
 *
 * @param {Object} req Objeto de requisição HTTP.
 * @param {Object} res Objeto de resposta HTTP utilizado para enviar a resposta ao cliente.
 *
 * @returns {JSON} Retorna a lista de clientes ou uma mensagem informando
 * que não há clientes cadastrados.
 *
 * @example
 * // GET /clientes
 * clienteController.buscarTodos(req, res);
 * // Resultado esperado:
 * // [
 * //   { id_cliente: 1, nome: "João", ... },
 * //   { id_cliente: 2, nome: "Maria", ... }
 * // ]
 *
 * // Caso não exista nenhum cliente:
 * // "Não existem clientes cadastrados na tabela"
 */



    buscarTodos: async (req, res) => {
        try {
            const clientes = await clienteModel.selecionarTodos();

            if (clientes.length === 0) {
                return req.status(200).json("Não existem clientes cadastrados na tabela");
            }

            return res.status(200).json(clientes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar clientes'
            });
        }
    },

    /**
 * @async
 * @function buscarPorId
 * Controlador responsável por buscar um cliente específico no banco de dados
 * com base no seu identificador (id_cliente).
 *
 * @param {Object} req Objeto de requisição HTTP contendo o id_cliente nos parâmetros da rota.
 * @param {Object} res Objeto de resposta HTTP usado para retornar a resposta ao cliente.
 *
 * @returns {JSON} Retorna os dados do cliente encontrado ou mensagens de erro/validação.
 *
 * @example
 * // GET /clientes/5
 * clienteController.buscarPorId(req, res);
 * // Resultado esperado:
 * // {
 * //   message: "Cliente:",
 * //   resultado: [
 * //     { id_cliente: 5, nome: "Carlos", cpf: "12345678900", ... }
 * //   ]
 * // }
 *
 * // Caso o ID não exista:
 * // { message: "Cliente não encontrado" }
 *
 * // Caso o ID seja inválido:
 * // { message: "Insira um ID válido" }
 */

    buscarPorId: async (req, res) => {
        try {
            const { id_cliente } = req.params;

            const id_cliente_int = Number(id_cliente);

            if (!id_cliente || !Number.isInteger(id_cliente_int)) {
                return res.status(400).json({ message: "Insira um ID válido" });
            }

            const resultado = await clienteModel.buscarPorId(id_cliente);

            if (resultado.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            return res.status(200).json({ message: "Cliente:", resultado })
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar o cliente'
            });
        }
    },

    /**
 * @async
 * @function criarCliente
 * Controlador responsável por cadastrar um novo cliente no banco de dados.
 * Realiza validações de tamanho, formatos de campos e verifica duplicidade de CPF.
 *
 * @param {Object} req Objeto de requisição HTTP contendo os dados do cliente no corpo da requisição (body).
 * @param {Object} res Objeto de resposta HTTP usado para enviar o retorno ao cliente.
 *
 * @returns {JSON} Retorna mensagem de sucesso e informações do cliente inserido,
 * ou mensagens de erro/validação.
 *
 * @example
 * // POST /clientes
 * // Body:
 * // {
 * //   "nome_cliente": "Maria",
 * //   "sobrenome_cliente": "Oliveira",
 * //   "cpf_cliente": "12345678901",
 * //   "telefone": "11987654321",
 * //   "email": "maria@gmail.com",
 * //   "logradouro": "Rua A",
 * //   "numero": 123,
 * //   "bairro": "Centro",
 * //   "estado": "SP",
 * //   "cep": "01234567",
 * //   "cidade": "São Paulo"
 * // }
 * clienteController.criarCliente(req, res);
 *
 * // Resultado esperado:
 * // {
 * //   message: "Cliente cadastrado com sucesso",
 * //   resultado: { insertId: 12, affectedRows: 1, ... }
 * // }
 *
 * // Caso CPF já exista:
 * // { message: "Cpf já existente" }
 * 
 * // Caso Email já exista:
 * // { message: "Email já existente" }
 *
 * // Caso falhem validações:
 * // { message: "Você inseriu valores de maneira inadequada" }
 */

    criarCliente: async (req, res) => {
        try {
            const { nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade } = req.body;

            const nome_string = String(nome_cliente.trim());
            const sobrenome_string = String(sobrenome_cliente.trim());
            const cep_string = String(cep.trim());
            const cpf_cliente_string = String(cpf_cliente.trim());
            const telefone_string = String(telefone.trim());
            const email_string = String(email.trim());

            if (!nome_cliente || !sobrenome_cliente || !cpf_cliente || !telefone || !email || !logradouro || !numero || !bairro || !cidade || !estado || !cep || cep_string.length !== 8 || cpf_cliente_string.length !== 11 || telefone_string.length < 8 || nome_string.length < 3 || nome_string.length > 50 || sobrenome_string.length < 3 || sobrenome_string.length > 255 || !email_string.includes("@") || email_string.length < 5) {
                return res.status(405).json({ message: "Você inseriu valores de maneira inadequada" });
            }

            const cpfExistente = await clienteModel.buscarPorCpf(cpf_cliente);

            if (cpfExistente.length !== 0) {
                return res.status(409).json({ message: "Cpf já existente" })
            }

            const emailExistente = await clienteModel.buscarPorEmail(email);
            if (emailExistente.length !== 0) {
                return res.status(409).json({ message: "Email já existente" })
            }

            const resultado = await clienteModel.inserirCliente(nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade);

            res.status(201).json({
                message: 'Cliente cadastrado com sucesso',
                resultado
            });

        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: 'Erro ao cadastrar cliente',
                error
            });
        }
    },

    /**
 * @async
 * @function atualizarCliente
 * Controlador responsável por atualizar os dados de um cliente existente no banco de dados.
 * Realiza validações de tipos, tamanhos, formatos e evita duplicidade de CPF.
 * Também permite atualização parcial, utilizando valores antigos caso algum campo não seja enviado.
 *
 * @param {Object} req Objeto de requisição HTTP contendo o id do cliente nos parâmetros
 * e os dados a serem atualizados no corpo da requisição.
 * @param {Object} res Objeto de resposta HTTP utilizado para enviar a resposta ao cliente.
 *
 * @returns {JSON} Retorna mensagem de sucesso e o resultado da operação,
 * ou mensagens de erro/validação quando aplicável.
 *
 * @example
 * // PUT /clientes/10
 * // Body:
 * // {
 * //   "nome_cliente": "Roberto",
 * //   "telefone": "21988887777"
 * // }
 * clienteController.atualizarCliente(req, res);
 *
 * // Resultado esperado:
 * // {
 * //   message: "Cliente atualizado com sucesso",
 * //   resultado: { affectedRows: 1, ... }
 * // }
 *
 * // Caso o ID seja inválido:
 * // { message: "O id não é válido" }
 *
 * // Caso o cliente não exista:
 * // { message: "Cliente não encontrado" }
 *
 * // Caso falhem as validações:
 * // { message: "Insira todos os valores de maneira correta!" }
 *
 * // Caso o CPF já exista:
 * // { message: "Cpf já existente" }
 * 
 * // Caso o Email já exista:
 * // { message: "Email já existente" }
 */

    atualizarCliente: async (req, res) => {
        try {
            const id = req.params.id;
            const { nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade } = req.body;

            const id_num = Number(id);

            if (!Number.isInteger(id_num) || !id) {
                return res.status(405).json({ message: "O id não é válido" });
            }

            const clienteAtual = await clienteModel.buscarPorId(id);

            if (clienteAtual.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            const novo_nome = nome_cliente ?? clienteAtual[0].nome;
            const novo_sobrenome = sobrenome_cliente ?? clienteAtual[0].sobrenome;
            const novo_cpf = cpf_cliente ?? clienteAtual[0].cpf;
            const novo_telefone = telefone ?? clienteAtual[0].telefone;
            const novo_email = email ?? clienteAtual[0].email;
            const novo_logradouro = logradouro ?? clienteAtual[0].logradouro;
            const novo_numero = numero ?? clienteAtual[0].numero;
            const novo_bairro = bairro ?? clienteAtual[0].bairro;
            const novo_estado = estado ?? clienteAtual[0].estado;
            const novo_cep = cep ?? clienteAtual[0].cep;
            const nova_cidade = cidade ?? clienteAtual[0].cidade;

            console.log(novo_nome, novo_sobrenome, novo_cpf, novo_telefone, novo_email, novo_logradouro, novo_numero, novo_bairro, novo_estado, novo_cep, nova_cidade);

            const nome_string = String(novo_nome.trim());
            const sobrenome_string = String(novo_sobrenome.trim());
            const cep_string = String(novo_cep.trim());
            const cpf_cliente_string = String(novo_cpf.trim());
            const telefone_string = String(novo_telefone.trim());
            const email_string = String(novo_email.trim());

            if (!novo_nome || !novo_sobrenome || !novo_cpf || !novo_telefone || !novo_email || !novo_logradouro || !novo_numero || !novo_bairro || !novo_estado || !novo_cep || !nova_cidade || cep_string.length !== 8 || cpf_cliente_string.length !== 11 || telefone_string.length < 8 || nome_string.length < 3 || nome_string.length > 50 || sobrenome_string.length < 3 || sobrenome_string.length > 255 || !email_string.includes("@") || email_string.length < 5) {
                return res.status(400).json({ message: "Insira todos os valores de maneira correta!" });
            }

            const cpfExistente = await clienteModel.buscarPorCpf(cpf_cliente);

            if (cpfExistente.length !== 0) {
                return res.status(409).json({ message: "Cpf já existente" });
            }

            const emailExistente = await clienteModel.buscarPorEmail(email);
            if (emailExistente.length !== 0) {
                return res.status(409).json({ message: "Email já existente" })
            }

            const resultado = await clienteModel.updateCliente(novo_nome, novo_sobrenome, novo_cpf, novo_telefone, novo_email, novo_logradouro, novo_numero, novo_bairro, novo_estado, novo_cep, nova_cidade, id);

            if(resultado.changedRows === 0) {
                return res.status(400).json({message: "Você não alterou nenhum valor"})
            }

            return res.status(200).json({ message: "Cliente atualizado com sucesso", resultado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao atualizar o cliente'
            });
        }
    },

    /**
 * @async
 * @function deletarCliente
 * Deleta um cliente do banco de dados de acordo com o id especificado.
 * 
 * @param {Object} req Objeto de requisição contendo o parâmetro `id` na URL.
 * @param {Object} res Objeto de resposta utilizado para retornar o status e mensagens ao cliente.
 *
 * @returns {Promise<Object>} Retorna uma resposta JSON contendo a mensagem de sucesso
 * e o resultado da exclusão. Em caso de erro, retorna mensagens adequadas com status HTTP.
 *
 * @throws {400} Se o ID fornecido for inválido.
 * @throws {404} Se nenhum cliente for encontrado com o ID informado.
 * @throws {500} Se ocorrer algum erro interno no servidor.
 *
 * @example
 * // Requisição DELETE para o endpoint:
 * // DELETE /clientes/5
 *
 * // Resposta esperada em caso de sucesso:
 * {
 *   "message": "Cliente deletado com sucesso!",
 *   "resultado": {
 *        "affectedRows": 1
 *   }
 * }
 */

    deletarCliente: async (req, res) => {
        try {
            const id = req.params.id;
            const id_num = Number(id);

            if (!id || !Number.isInteger(id_num)) {
                return res.status(400).json({ message: "Insira um id válido" });
            }

            const clienteSelecionado = await clienteModel.buscarPorId(id);

            if (clienteSelecionado.length === 0) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            const pedidoRelacionado = await pedidoModel.buscarPedidosPorCliente(id)

            if (pedidoRelacionado.length !== 0) {
                return res.status(400).json({ message: "Ainda existem pedidos relacionados ao cliente. Delete o pedido primeiro." })
            }

            const resultado = await clienteModel.deleteCliente(id);

            return res.status(200).json({ message: "Cliente deletado com sucesso!", resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao deletar o cliente'
            });
        }
    }

};

module.exports = { clienteController };