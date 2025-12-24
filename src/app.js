import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './views/views.router.js'; 

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Conexión
const MONGO_URL = "mongodb+srv://carodriguez0104_db_user:coder12345@cluster0.r7frw4y.mongodb.net/ecommerce?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(error => console.log("❌ Error:", error.message));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => console.log(`🚀 Server en http://localhost:${PORT}`));