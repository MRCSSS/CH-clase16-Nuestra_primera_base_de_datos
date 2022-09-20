import knex from 'knex';
import { config } from '../utils/config.js';

const prodKnexCli = knex(config.db_products);
const msgsKnexCli = knex(config.db_messages);


prodKnexCli.schema.dropTableIfExists('products')
    .then(()=>{
        prodKnexCli.schema.createTable('products', table => {
            table.increments('id').primary();
            table.string('title', 50).notNullable();
            table.integer('price').notNullable();
            table.text('thumbnail').notNullable();
        })
            .then(()=> console.log("Products table created"))
            .catch(err=> {
                console.log(err); 
                throw err;
            })
            .finally(()=>{
                prodKnexCli.destroy();
            });
    });

msgsKnexCli.schema.dropTableIfExists('messages')
    .then(()=>{
        msgsKnexCli.schema.createTable('messages', table => {
            table.string('author', 50).notNullable();
            table.string('date', 50).notNullable();
            table.text('message').notNullable();
        })
            .then(()=> console.log("Messages table created"))
            .catch(err=> {
                console.log(err); 
                throw err;
            })
            .finally(()=>{
                msgsKnexCli.destroy();
            });
    });

