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
            const { nome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, cidade, estado, cep } = req.body;

            const novoCliente = { nome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro,cidade,estado, cep };

            const resultado = await clienteModel.inserirCliente(novoCliente);

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
