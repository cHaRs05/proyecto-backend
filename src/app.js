import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io'; 
import { ProductManager } from './managers/ProductManager.js'; 
import viewsRouter from './routes/views/views.router.js'; 
import productsRouter from './routes/products.router.js'; 
import cartsRouter from './routes/carts.router.js';

const app = express();
const PORT = 8080;
const productManager = new ProductManager('./products.json'); 
const httpServer = app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
export const io = new Server(httpServer); 

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 

io.on('connection', (socket) => {
    console.log(`[Socket] Nuevo cliente conectado: ${socket.id}`);
    const emitUpdatedProducts = async () => {
        const updatedProducts = await productManager.getAllProducts();
        io.emit('updateProducts', updatedProducts);
    };
    productManager.getAllProducts()
        .then(products => {
            socket.emit('updateProducts', products);
        })
        .catch(error => console.error("Error al obtener productos iniciales:", error));
    socket.on('addProduct', async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            await emitUpdatedProducts();
        } catch (error) {
            console.error("Error al añadir producto por socket:", error.message);
        }
    });
    socket.on('deleteProduct', async (productId) => {
        try {
            const success = await productManager.deleteProduct(productId);
            if (success) {
                await emitUpdatedProducts();
            }
        } catch (error) {
            console.error("Error al eliminar producto por socket:", error.message);
        }
    });
});