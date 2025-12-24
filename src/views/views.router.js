import { Router } from 'express';
import { productModel } from '../models/product.model.js';
import { cartModel } from '../models/cart.model.js';

const router = Router();

// Catálogo
router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await productModel.paginate({}, { page: parseInt(page), limit: parseInt(limit), lean: true });
        res.render('products', { products: result.docs, ...result });
    } catch (error) {
        res.status(500).send("Error al cargar productos");
    }
});

// Carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid)
            .populate('products.product') 
            .lean(); 
        
        res.render('cartDetail', { 
            products: cart.products, 
            cartId: req.params.cid 
        });
    } catch (error) {
        res.status(500).render('error', { error: 'Carrito no encontrado' });
    }
});

// Formulario Final
router.get('/checkout', (req, res) => {
    res.render('checkoutForm');
});

export default router;