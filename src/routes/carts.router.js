/**
 * @file Carts.router.js
 * @description Rutas para la gestión de carritos de compra.
 */
import { Router } from 'express';
import { cartModel } from '../models/cart.model.js';
import { productModel } from '../models/product.model.js';

const router = Router();

/**
 * @method POST /api/carts
 * @description Crea un nuevo carrito vacío.
 */
router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al crear el carrito' });
    }
});

/**
 * @method GET /api/carts/:cid
 * @description Obtener un carrito con todos sus productos completos.
 */
router.get('/:cid', async (req, res) => {
    try {
        // 'populate' convierte los IDs de productos en objetos de hardware completos
        const cart = await cartModel.findById(req.params.cid).populate('products.product').lean();
        
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

/**
 * @method POST /api/carts/:cid/product/:pid
 * @description Lógica de negocio para agregar un producto al carrito o incrementar su cantidad.
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // 1. Verificaciones de seguridad
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });

        const product = await productModel.findById(pid);
        if (!product) return res.status(404).send({ status: 'error', message: 'Producto no encontrado en stock' });

        // 2. Buscar si el producto ya existe en este carrito
        const productInCartIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productInCartIndex !== -1) {
            // Si existe, solo incrementar la cantidad
            cart.products[productInCartIndex].quantity++;
        } else {
            // Si no existe, agregarlo con cantidad 1
            cart.products.push({ product: pid, quantity: 1 });
        }

        // 3. Guardar cambios
        await cart.save();
        res.send({ status: 'success', message: 'Producto agregado al carrito con éxito' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

/**
 * @method DELETE /api/carts/:cid/products/:pid
 * @description Eliminar un producto específico del carrito.
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        
        if (!cart) return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });

        // Filtrar el array para excluir el producto a eliminar
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        
        await cart.save();
        res.send({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

/**
 * @method PUT /api/carts/:cid
 * @description Actualizar el carrito entero con un nuevo arreglo de productos.
 */
router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findByIdAndUpdate(
            req.params.cid, 
            { products: req.body }, 
            { new: true } // Retorna el documento actualizado
        );
        
        res.send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

/**
 * @method PUT /api/carts/:cid/products/:pid
 * @description Actualizar solo la cantidad de un producto específico.
 */
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });

        // Buscar el producto puntual
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        
        if (productInCart) {
            productInCart.quantity = quantity;
            await cart.save();
            res.send({ status: 'success', message: 'Cantidad de producto actualizada' });
        } else {
            res.status(404).send({ status: 'error', message: 'El producto no está en el carrito' });
        }
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

/**
 * @method DELETE /api/carts/:cid
 * @description Vaciar el carrito (eliminar todos los productos).
 */
router.delete('/:cid', async (req, res) => {
    try {
        // Actualizamos el carrito
        await cartModel.findByIdAndUpdate(req.params.cid, { products: [] });
        res.send({ status: 'success', message: 'Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

export default router;