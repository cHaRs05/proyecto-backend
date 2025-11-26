import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
    constructor(path) {
        this.path = path; 
    }

    async #readData() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async #writeData(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf8');
    }

    async getAllProducts() { 
        return await this.#readData();
    }

    async addProduct(productData) {
        const products = await this.#readData();
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missing = requiredFields.filter(field => !productData.hasOwnProperty(field));
        if (missing.length > 0) {
            throw new Error(`Faltan campos obligatorios: ${missing.join(', ')}`);
        }
        
        if (products.some(p => p.code === productData.code)) {
            throw new Error(`El código del producto '${productData.code}' ya existe.`);
        }

        const newProduct = {
            id: uuidv4(),
            status: true, 
            thumbnails: productData.thumbnails || [],
            ...productData
        };

        products.push(newProduct);
        await this.#writeData(products);
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.#readData();
        return products.find(p => p.id === id);
    }

    async updateProduct(id, updates) {
        const products = await this.#readData();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return null;
        }

        delete updates.id; 
        products[index] = { ...products[index], ...updates };
        
        await this.#writeData(products);
        return products[index];
    }
    
    async deleteProduct(id) {
        const products = await this.#readData();
        const initialLength = products.length;
        const newProducts = products.filter(p => p.id !== id); 

        if (newProducts.length === initialLength) {
            return false;
        }

        await this.#writeData(newProducts);
        return true;
    }
}