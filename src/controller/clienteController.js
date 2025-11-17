const clienteModel = require('../model/clienteModel');

const clienteController = {

    buscarTodos: async (req, res) => {
        try {
            const clientes = await clienteModel.selecionarTodos();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({
                message: 'Erro ao buscar clientes',
                error
            });
        }
    },


    criarCliente: async (req, res) => {
        try {
            const { nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep } = req.body;

            const nome_string = String(nome_cliente.trim());
            const sobrenome_string = String(sobrenome_cliente.trim());
            const cep_string = String(cep.trim());
            const cpf_cliente_string = String(cpf_cliente.trim());


            if (!nome_cliente || !sobrenome_cliente || !cpf_cliente || !telefone || !email || !logradouro || !numero || !bairro || !cidade || !estado || !cep || cep_string.length !== 8 || cpf_cliente_string.length !== 11 || telefone.length < 8 ) {
                return res.status(405).json({message: "Você inseriu valores de maneira inadequada"});
            }

            const resultado = await clienteModel.inserirCliente(nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep);

            res.status(201).json({
                message: 'Cliente cadastrado com sucesso',
              resultado
            });

        } catch (error) {
            res.status(500).json({
                message: 'Erro ao cadastrar cliente',
                error
            });
        }
    }

};

module.exports = { clienteController };
