/**
 * @file Views.router.js
 * @description Maneja las rutas que renderizan las vistas de Handlebars para el frontend.
 */
import { Router } from 'express';
import { productModel } from '../models/product.model.js';
import { cartModel } from '../models/cart.model.js';

const router = Router();

// Redirección de la raíz
router.get('/', (req, res) => {
    res.redirect('/products');
});

// Vista principal de productos
router.get('/products', async (req, res) => {
    try {
        let { page = 1, limit = 10, sort, query } = req.query;
        
        let options = { 
            page: parseInt(page), 
            limit: parseInt(limit), 
            lean: true 
        };
        
        // Ordenamiento por precio
        if (sort) options.sort = { price: sort === 'asc' ? 1 : -1 };
        
        // Filtro flexible por categoría
        let filter = query ? { category: query } : {};
        
        const result = await productModel.paginate(filter, options);
        
        // links de navegación
        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        res.render('index', { products: result });
        
    } catch (error) {
        console.error('Error en vista de productos:', error);
        res.status(500).send("Error al cargar la tienda. Intente más tarde.");
    }
});

// Vista de detalle de hardware puntual
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).render('404');
        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).send("Error al cargar el producto");
    }
});

// Vista de un carrito con Populate
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.render('cart', { cart });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

export default router;