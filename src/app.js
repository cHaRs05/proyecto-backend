import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// Configuración de Handlebars 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views'); 

// CONEXIÓN A MONGODB ATLAS
const MONGO_URL = "mongodb+srv://carodriguez0104_db_user:ClaveFacultad123@cluster0.r7frw4y.mongodb.net/hardwareStore?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ ¡Éxito! Conectado a MongoDB Atlas (Base: hardwareStore)"))
    .catch(error => console.error("❌ Error al conectar a la base de datos:", error));

// 4. Definición de las rutas del proyecto
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// 5. Encendido del servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en: http://localhost:${PORT}`);
});