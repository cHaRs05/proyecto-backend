import { Router } from 'express';
import { ProductManager } from '../../managers/ProductManager.js'; 

const router = Router();
const productManager = new ProductManager('./products.json'); 
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('home', { products: products, title: "Lista de Productos con Handlebars" }); 
    } catch (error) {
        console.error("Error al cargar la vista Home:", error);
        res.status(500).send("Error al cargar la vista Home");
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products: products, title: "Productos en Tiempo Real (Socket.io)" }); 
    } catch (error) {
        console.error("Error al cargar la vista Real Time Products:", error);
        res.status(500).send("Error al cargar la vista Real Time Products");
    }
});

export default router;