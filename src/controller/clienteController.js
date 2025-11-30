const { clienteModel } = require('../model/clienteModel');

const clienteController = {



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

            const novo_nome = nome_cliente ?? clienteAtual[0].nome_cliente;
            const novo_sobrenome = sobrenome_cliente ?? clienteAtual[0].sobrenome_cliente;
            const novo_cpf = cpf_cliente ?? clienteAtual[0].cpf_cliente;
            const novo_telefone = telefone ?? clienteAtual[0].telefone;
            const novo_email = email ?? clienteAtual[0].email;
            const novo_logradouro = logradouro ?? clienteAtual[0].logradouro;
            const novo_numero = numero ?? clienteAtual[0].numero;
            const novo_bairro = bairro ?? clienteAtual[0].bairro;
            const novo_estado = estado ?? clienteAtual[0].estado;
            const novo_cep = cep ?? clienteAtual[0].cep;
            const nova_cidade = cidade ?? clienteAtual[0].cidade;

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

            const resultado = await clienteModel.atualizarCliente(nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade, id);

            return res.status(200).json({ message: "Cliente atualizado com sucesso", resultado });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao atualizar o cliente'
            });
        }
    },

    deletarCliente: async (req, res) => {
        try {
        const id = req.params.id;
        const id_num = Number(id);

        if (!id || !Number.isInteger(id_num)) {
            return res.status(400).json({ message: "Insira um id válido" });
        }

        const clienteSelecionado = await clienteModel.buscarPorId(id);

        if (clienteSelecionado.length === 0) {
            return res.status(404).json("Cliente não encontrado");
        }

        const resultado = await clienteModel.deleteCliente(id_cliente);

        return res.status(200).json({message: "Cliente deletado com sucesso!", resultado});

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Erro ao deletar o cliente'
            });
        }
    }

};

module.exports = { clienteController };
