import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
    isAdmin: true,
    db_products: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'mss',
            password: 'mss',
            database: 'Primera_DB'
        }
    },
    db_messages: {
        client: 'better-sqlite3',
        connection: {
            filename: path.join(__dirname, '../../DB/ecommerce.db3')
        },
        useNullAsDefault: true
    }

}
