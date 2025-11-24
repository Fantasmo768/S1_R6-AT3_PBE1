const { clienteModel } = require('../model/clienteModel');

const clienteController = {

    buscarTodos: async (req, res) => {
        try {
            const clientes = await clienteModel.selecionarTodos();
            return res.status(200).json(clientes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao buscar clientes'
            });
        }
    },

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

            return res.status(200).json({message: "Cliente:", resultado})
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message: 'Erro ao buscar clientes'
            });
        }
    },

    criarCliente: async (req, res) => {
        try {
            const { nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade } = req.body;

            const nome_string = String(nome_cliente.trim());
            const sobrenome_string = String(sobrenome_cliente.trim());
            const cep_string = String(cep.trim());
            const cpf_cliente_string = String(cpf_cliente.trim());


            if (!nome_cliente || !sobrenome_cliente || !cpf_cliente || !telefone || !email || !logradouro || !numero || !bairro || !cidade || !estado || !cep || cep_string.length !== 8 || cpf_cliente_string.length !== 11 || telefone.length < 8 || nome_string.length < 3 || nome_string.length > 50 || sobrenome_string.length < 3 || sobrenome_string.length > 255) {
                return res.status(405).json({ message: "Você inseriu valores de maneira inadequada" });
            }

            const cpfExistente = await clienteModel.buscarPorCpf(cpf_cliente);

            if (cpfExistente.length !== 0) {
                return res.status(409).json({ message: "Cpf já existente" })
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

};

module.exports = { clienteController };
