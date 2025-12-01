# S1_R6-AT3_PBE1

## Introdução
Este é um projeto desenvolvido por alunos do SENAI, em função da empresa Rápido & Seguro Logística. O escopo inicial do projeto é desenvolver uma API capaz de registrar clientes, pedidos e entregas ao banco de dados da empresa. O cliente está passando por problemas no registro de entrega, sendo necessário um sistema eficiente para calcular e registrar os valores das entregas de maneira automatizada. A API foi desenvolvida, para suprir novas necessidades citadas anteriormente que a empresa enfrenta devido ao crescimento acelerado no mercado. Com base nas necessidades da empresa e do escopo, foram desenvolvidas funções para adicionar, buscar, deletar e atualizar clientes, pedidos e entregas no banco de dados da corporação. Para a realização da proposta, foram utilizadas as seguintes tecnologias: Node.js (com auxílio dos Frameworks express e mysql2), MySQL e versionamento com github.

## Etapas do projeto

O projeto foi dividido em 3 etapas: Desenvolvimento do banco de dados (Com 3 tabelas clientes, pedidos e entregas), desenvolvimento das funcionalidades básicas para cada tabela no banco de dados e desenvolvimento de funções adicionais para qualidade de usuabilidade no sistema.

  ### Etapa 1: Desenvolvimento do banco de dados

  O desenvolvimento do banco de dados se inicia com o modelo de entidade relacionamento. O modelo foi feito com objetivo de planejar os tipos de dados adequados para cada coluna da tabela, facilitando o desenvolvimento do banco de dados no SGBD (MySql WorkBench). Após a realização do modelo de entidade relacionamneto, se inicia o desenvolvimento do banco de dados na ferramenta MySql WorkBench. Na ferramenta escolhida, foram criadas 3 tabelas (clientes, pedidos e entregas), para facilitar o desenvolvimento das entidades, foi utilizado a   funcionalidade do MySql WorkBench denominada de "Create New Schema", que permite a criação de um banco de dados através de uma interface gráfica.
  
Na tabela de clientes as colunas necessárias foram: 
- id_cliente (AI NN PK INT); 
- nome (VARCHAR(50) NN);
- sobrenome(VARCHAR(255) NN);
- cpf (UQ NN CHAR(11));
- telefone (varchar(25) NN);
- email (NN UQ VARCHAR(150));
- logradouro (NN VARCHAR(255));
- numero (NN VARCHAR(10));
- bairro (NN VARCHAR(50));
- estado(NN VARCHAR(30));
- cep (NN CHAR(8));
- cidade (VARCHAR(255) NN).

Na entidade de pedidos os campos necessários foram: 
- id_pedido (AI NN PK INT);
- data_pedido (NN DATE);
- entrega_urgente (NN BOOLEAN);
- distancia (DECIMAL (10,2) NN);
- peso (DECIMAL(10,2) NN);
- valor_km (DECIMAL(10,2) NN);
- valor_kg (DECIMAL(10,2) NN);
- id_cliente (NN FK INT).

Na tabela entregas os atributos necessários foram: 
- id_entrega (AI NN PK INT);
- valor_distancia (NN DECIMAL(10,2));
- valor_peso (NN DECIMAL(10,2));
- acrescimo (NN, DECIMAL(10,2));
- desconto (NN, DECIMAL(10,2));
- taxa (NN, BOOLEAN);
- valor_final (NN DECIMAL(10,2));
- status_entrega (NN ENUM);
- id_pedido (NN FK INT).

### Etapa 2 Desenvolvimento das funcionalidades básicas do projeto
Após o desenvolvimento do banco de dados, se inicia o desenvolvimento das funcionalidades básicas do projeto, sendo elas: Insert de clientes, pedidos e entregas. O projeto foi feito utilizando a arquitetura MVC (OBS: o view não foi utilizado pois o front-end não foi solicitado), com cada entidade tendo seu próprio controller, model e routes. Para iniciação adequada do projeto é necessário executar no terminal os seguintes comandos: npm init -y, npm install express mysql2. Estes comandos certificam a instalação de todas as bibliotecas necessárias para o funcionamento adequado do programa. A programação se inicia com o arquivo db.js, presente em src/config, o arquivo é responsável pela configuração do banco de dados (configurando o host, user, database, port e os limites de conexão). Em seguida vem a criação do arquivo server.js, que será responsável por receber todas as rotas configuradas e todos os jsons enviados e abrir o servidor escutando à porta 8081. Ao final da configuração inicial do servidor foi adicionado um arquivo nomeado de .gitignore, para não enviar pastas ou arquivos pesadps ao repositório remoto (node_modules e package-lock.json). _OBS: As etapas de desenvolvimento seguem a ordem específica de cliente > pedidos > entregas, pois clientes não depende de nenhuma entidade, pedidos depende de clientes e entregas depende de pedidos.

#### Insert de clientes
Após a configuração inicial do programa, foi feito as funções do model necessárias para a realização do insert de clientes. As funções primariamente desenvolvidas do model foram: selecionarTodos, inserirCliente e buscarPorId, nessa ordem, todas presente no caminho "../src/model/clienteModel.js". Todas estas funções são assíncronas para ser possível a utilização do "await", que permite certas partes do código esperarem eventos ocorrerem, evitando possíveis erros relacionados à atrasos de resposta. Todas estas funções possuem um modelo específico, em que se envia uma linha de comando sql para ser executado no banco de dados com os parâmetros que forem enviados (no caso de selecionarTodos nenhum parâmetro é enviado, pois não existe nenhuma seleção específica).

Após a configuração completa do model, é necessário programar as funções do controller