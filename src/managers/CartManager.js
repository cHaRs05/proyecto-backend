import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
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

    async #writeData(carts) {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf8');
    }

    async createCart() {
        const carts = await this.#readData();
        const newCart = {
            id: uuidv4(),
            products: []
        };

        carts.push(newCart);
        await this.#writeData(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.#readData();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.#readData();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            return null;
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        carts[cartIndex] = cart; 
        
        await this.#writeData(carts);
        return cart;
    }
}

export default CartManager;