const mysql = require('mysql2/promise');

const pool = mysql.createPool({
      host:'localhost',
      user:'root',
      password:'1234',
      database:'loja_db',
      port: 3308,
      waitForConnections: true, // aguarda conexões livres
      connectionLimit: 10,  // limita o numero de conexões simultaneas
      queueLimit: 0 // sem limite para a fila de conexões
});

(async ()=> {
    try {
        const connection = await pool.getConnection();
        console.log(`Conectado ao MySQL`);
        connection.release();
    } catch (error) {
       console.error(`erro ao conectar ao  MySQL: ${error}`); 
    }
})();

module.exports = pool;