import { Router } from 'express';
import { cartModel } from '../models/cart.model.js'; 

const router = Router();

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findById(cid).populate('products.product').lean();
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }
        
        await cart.save();
        res.send({ status: "success", message: "Producto añadido al carrito" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        res.send({ status: "success", message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await cartModel.findByIdAndUpdate(cid, { $set: { products } }, { new: true }).lean();
        res.send({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            res.send({ status: "success", message: "Cantidad actualizada" });
        } else {
            res.status(404).send({ status: "error", message: "Producto no encontrado en el carrito" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", message: "Carrito vaciado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;