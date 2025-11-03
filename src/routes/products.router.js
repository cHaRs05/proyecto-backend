import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js'; 

const router = Router();
const productManager = new ProductManager('./products.json'); 

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params; 
    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    const newProductData = req.body;
    try {
        const newProduct = await productManager.addProduct(newProductData);
        res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(pid, updates);
        if (updatedProduct) {
            res.json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
        } else {
            res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const success = await productManager.deleteProduct(pid);
        if (success) {
            res.json({ message: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;