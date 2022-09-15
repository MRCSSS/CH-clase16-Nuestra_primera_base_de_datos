const fs = require('fs');

class MessagesContenedor {
    constructor(path) {
        this.path = path
    }

    // Recibe un mensajes y lo guarda en el archivo.
    async save(msg) {
        try {
            const objects = await this.getAll();
        
            objects.push(msg);

            await fs.promises.writeFile(this.path, JSON.stringify(objects, null, 2));

        } catch (error) {
            console.log('Error al guardar: ',error)
        }
    }
    
    // Devuelve un array con los mensajes presentes en el archivo.
    async getAll() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log(`Error al leer el archivo en ${this.path}`, error);
            return [];
        }
    }

    // Elimina todos los mensajes presentes en el archivo.
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, 2))
        } catch (error) {
            console.log('deleteAll(): ', error);
        }
    }
}

module.exports = MessagesContenedor;