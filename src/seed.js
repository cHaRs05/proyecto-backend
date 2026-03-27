import mongoose from 'mongoose';
import { productModel } from './models/product.model.js';

const MONGO_URL = "mongodb+srv://carodriguez0104_db_user:ClaveFacultad123@cluster0.r7frw4y.mongodb.net/hardwareStore?retryWrites=true&w=majority&appName=Cluster0";

const products = [
    { title: "Nvidia RTX 4090", description: "La placa más potente del mercado", price: 2500, thumbnail: "https://url-imagen.com/4090.jpg", code: "GPU001", stock: 10, category: "GPU" },
    { title: "Nvidia RTX 4080", description: "Excelente para 4K", price: 1200, thumbnail: "https://url-imagen.com/4080.jpg", code: "GPU002", stock: 15, category: "GPU" },
    { title: "AMD Ryzen 9 7950X", description: "Procesador de 16 núcleos", price: 600, thumbnail: "https://url-imagen.com/r9.jpg", code: "CPU001", stock: 20, category: "CPU" },
    { title: "Intel Core i9-14900K", description: "El tope de gama de Intel", price: 580, thumbnail: "https://url-imagen.com/i9.14.jpg", code: "CPU002", stock: 12, category: "CPU" },
    { title: "Monitor Samsung Odyssey G9", description: "49 pulgadas ultra wide", price: 1500, thumbnail: "https://url-imagen.com/g9.jpg", code: "MON001", stock: 5, category: "Monitor" },
    { title: "Memoria RAM Corsair 32GB", description: "DDR5 6000MHz", price: 150, thumbnail: "https://url-imagen.com/ram.jpg", code: "RAM001", stock: 30, category: "RAM" },
    { title: "SSD Samsung 990 Pro 2TB", description: "NVMe Gen4 ultra rápido", price: 180, thumbnail: "https://url-imagen.com/ssd.jpg", code: "STG001", stock: 40, category: "Storage" },
    { title: "Fuente ASUS Thor 1200W", description: "Certificación 80 Plus Platinum", price: 350, thumbnail: "https://url-imagen.com/thor.jpg", code: "PSU001", stock: 8, category: "Power" },
    { title: "Gabinete Lian Li O11D", description: "El favorito para setups estéticos", price: 200, thumbnail: "https://url-imagen.com/lianli.jpg", code: "CASE001", stock: 15, category: "Case" },
    { title: "Nvidia RTX 4070 Ti", description: "Ideal para 1440p competitivo", price: 850, thumbnail: "https://url-imagen.com/4070.jpg", code: "GPU003", stock: 12, category: "GPU" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        await productModel.deleteMany({});
        await productModel.insertMany(products);
        console.log("✅ ¡Productos de hardware cargados con éxito!");
        process.exit();
    } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        process.exit(1);
    }
};

seedDB();