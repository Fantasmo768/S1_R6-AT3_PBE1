# S1_R6-AT3_PBE1

## Introdução
Este é um projeto desenvolvido por alunos do SENAI, em função da empresa Rápido & Seguro Logística. O escopo inicial do projeto é desenvolver uma API capaz de registrar clientes, pedidos e entregas ao banco de dados da empresa. O cliente está passando por problemas no registro de entrega, sendo necessário um sistema eficiente para calcular e registrar os valores das entregas de maneira automatizada. A API foi desenvolvida, para suprir novas necessidades citadas anteriormente que a empresa enfrenta devido ao crescimento acelerado no mercado. Com base nas necessidades da empresa e do escopo, foram desenvolvidas funções para adicionar, buscar, deletar e atualizar clientes, pedidos e entregas no banco de dados da corporação.

Tecnologias usadas:
- Node.js
- Express
- mysql2
- MySQL
- Git (GitHub)

## Estrutura do projeto
- src/
  - config/
    - db.js             (configuração da conexão MySQL)
  - controller/
    - clienteController.js
    - pedidoController.js
    - entregaController.js
  - model/
    - clienteModel.js
    - pedidoModel.js
    - entregaModel.js
  - routes/
    - clienteRoutes.js
    - pedidoRoutes.js
    - entregaRoutes.js
    - routes.js
  - server.js           (inicia o servidor)
- docs/
  - README.md
- .gitignore
- package.json

## Banco de dados
O banco possui 3 tabelas principais: clientes, pedidos e entregas. A ordem lógica de criação/uso é: clientes → pedidos → entregas.

Criação das tabelas (utilizando linguagem sql e MysqlWorkbench):
```sql
CREATE TABLE clientes (
  id_cliente INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  sobrenome VARCHAR(255) NOT NULL,
  cpf CHAR(11) NOT NULL UNIQUE,
  telefone VARCHAR(25) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  logradouro VARCHAR(255) NOT NULL,
  numero VARCHAR(10) NOT NULL,
  bairro VARCHAR(50) NOT NULL,
  estado VARCHAR(30) NOT NULL,
  cep CHAR(8) NOT NULL,
  cidade VARCHAR(255) NOT NULL
);

CREATE TABLE pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  data_pedido DATE NOT NULL,
  entrega_urgente BOOLEAN NOT NULL,
  distancia DECIMAL(10,2) NOT NULL,
  peso DECIMAL(10,2) NOT NULL,
  valor_km DECIMAL(10,2) NOT NULL,
  valor_kg DECIMAL(10,2) NOT NULL,
  id_cliente INT NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE entregas (
  id_entrega INT AUTO_INCREMENT PRIMARY KEY,
  valor_distancia DECIMAL(10,2) NOT NULL,
  valor_peso DECIMAL(10,2) NOT NULL,
  acrescimo DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) NOT NULL,
  taxa BOOLEAN NOT NULL,
  valor_final DECIMAL(10,2) NOT NULL,
  status_entrega ENUM('pendente','em_transito','entregue','cancelado') NOT NULL,
  id_pedido INT NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
);
```

## Regras de negócio principais
- valor_distancia = distancia * valor_km
- valor_peso = peso * valor_kg
- acrescimo: aplicado quando entrega_urgente = true (implementação no controller — percentual ou valor fixo conforme código)
- desconto: subtraído do total quando informado
- taxa (boolean): controla aplicação de taxa fixa/variável (ver controller)
- valor_final = valor_distancia + valor_peso + acrescimo - desconto (+ taxa se aplicável)
- status_entrega inicial: "pendente"

## Instalação e execução (Windows)
1. Abra o terminal no diretório do projeto:
   cd c:\Users\DES-I1HS\Desktop\AulasSENAI\Semestre2\PBE1\Exercicios\S1_R6-AT3_PBE1
2. Instale dependências:
   npm install express mysql2
3. Configure src/config/db.js com credenciais MySQL (host, user, password, database, port).
4. Inicie o servidor:
   node server.js
5. Servidor padrão: http://localhost:8081 (verificar server.js)

## Endpoints principais

Clientes
- POST /clientes/adicionar — cria cliente
  Corpo JSON: { nome_cliente, sobrenome_cliente, cpf_cliente, telefone, email, logradouro, numero, bairro, estado, cep, cidade }
- GET /clientes — lista todos
- GET /clientes/:id_cliente — busca por id
- PUT /clientes/atulizar/:id — atualiza cliente
- DELETE /clientes/deletar/:id — remove cliente

Pedidos
- POST /pedidos/adicionar — cria pedido
  Corpo JSON: { data_pedido, entrega_urgente, distancia, peso, valor_km, valor_kg, id_cliente, status_entrega }
- GET /pedidos
- GET /pedidos/:id_pedido
- PUT /pedidos/atulizar/:id_pedido
- DELETE /pedidos/deletar/:id

Entregas
- POST /entregas/adicionar — cria entrega (calcula valores automaticamente)
  Corpo JSON mínimo: { status_entrega, id_pedido }
- GET /entregas
- GET /entregas/:id_entrega
- PUT /entregas/atualizar/:id_entrega
- DELETE /entregas/deletar/:id

## Como utilizar a API e exemplos de uso
Para utilização da API, é preferível o uso do insomnia ou curl (utilizando CMD). Observação para rotas PUT (update): Nesse tipo de rota _Não é necessário o envio de todos os dados do corpo JSON informados na rota POST, apenas aqueles que você quer atualizar.

### Utilização e exemplos com CURL (windows)

Para utilizar a api com curl, abra o prompt de comando do seu computador e digite o comando enviando todos os dados requisitados pelo sistema no corpo JSON (corpo JSON minímo de cada endpoint informado acima).

#### Exemplos de comando com CURL para cada rota

**POST /clientes/adicionar:**
```curl -X POST http://localhost:8081/clientes/adicionar -H "Content-Type: application/json" -d "{\"nome_cliente\":\"Joao\",\"sobrenome_cliente\":\"Maziero\",\"cpf_cliente\":\"12345678908\",\"telefone\":\"11999999999\",\"email\":\"joao@gmail.com\",\"cep\":\"01001000\",\"logradouro\":\"Rua A\",\"numero\":100,\"bairro\":\"Centro\",\"cidade\":\"São Paulo\",\"estado\":\"São Paulo\"}"
```

**GET /clientes**
```curl http://localhost:8081/clientes
```

**GET /clientes/id_cliente**
```curl http://localhost:8081/clientes/1
```

**PUT /clientes/atualizar/id_cliente**
```curl -X PUT http://localhost:8081/clientes/atualizar/3 -H "Content-Type: application/json" -d "{\"telefone\":\"11988887777\",\"email\":\"novoemail@gmail.com\"}"
```

Criar pedido:
curl -X POST http://localhost:8081/pedidos -H "Content-Type: application/json" -d "{\"data_pedido\":\"2025-12-04\",\"entrega_urgente\":true,\"distancia\":10.5,\"peso\":2.3,\"valor_km\":1.20,\"valor_kg\":2.50,\"id_cliente\":1}"

Criar entrega:
curl -X POST http://localhost:8081/entregas -H "Content-Type: application/json" -d "{\"id_pedido\":1,\"distancia\":10.5,\"peso\":2.3,\"valor_km\":1.20,\"valor_kg\":2.50,\"entrega_urgente\":true,\"acrescimo\":0,\"desconto\":0,\"taxa\":false}"

## Validações e tratamento de erros
- Controllers validam campos obrigatórios e formatos básicos (CPF, email).
- Respostas HTTP padronizadas: 201 (criado), 200 (sucesso), 400 (request inválido), 404 (não encontrado), 500 (erro servidor).
- Transações são usadas em operações que afetam múltiplas tabelas (pedidos e entregas).

## Contato / Autoria
Autores: João Maziero e Luis Felipe
Instrutor: Izaias Maia e Maycon Esprício