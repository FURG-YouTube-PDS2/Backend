import { createConnection } from 'typeorm';

// Procura arquivo ormconfig.json no projeto e já importa as informações
// e faz a conexão com o banco dados
createConnection(); 