import knex from 'knex';
import { config } from '../utils/config.js';
import moment from 'moment';

export class ProdContenedor {
    constructor(tableName) {
        this.knexCli = knex(config.db_products);
        this.tableName = tableName;
    }

    async getAll(){
        try {
            return await this.knexCli.from(this.tableName).select('*').orderBy('id', 'asc');
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            return await this.knexCli.from(this.tableName).select('*').where({id: id});
        } catch (error) {
            throw error;
        }
    }

    async save(object) {
        try {
            return await this.knexCli(this.tableName).insert(object);
        } catch (error) {
            throw error;
        }
    }

    async update(id, obj){
        try {
            return await this.knexCli.from(this.tableName).where({id: id}).update(obj);
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id){
        try {
            return await this.knexCli.from(this.tableName).where({id: id}).del();
        } catch (error) {
            throw error;
        }
    }

    closeConection(){
        this.knexCli.destroy();
    }
}
