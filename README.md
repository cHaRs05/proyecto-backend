# 💻 Hardware Store - Backend E-commerce
**Proyecto: Segunda entrega - Curso de Programación Backend**

Este proyecto consiste en un servidor robusto para una tienda de componentes de hardware, utilizando **Node.js**, **Express** y **MongoDB Atlas**. Implementa una arquitectura profesional con separación de rutas, modelos y vistas dinámicas.

---

## 🚀 Tecnologías y Herramientas
* **Node.js & Express**: Motor del servidor y gestión de rutas.
* **MongoDB Atlas**: Persistencia de datos en la nube (Base de datos: `hardwareStore`).
* **Mongoose**: Modelado de datos y uso de `mongoose-paginate-v2` para la gestión de productos.
* **Handlebars**: Motor de plantillas para la interfaz de usuario dinámica.
* **Thunder Client / Postman**: Pruebas de endpoints de la API.

---

## 🛠️ Funcionalidades Implementadas

### 1. Gestión de Productos (Products)
* **Paginación**: El endpoint `/api/products` y la vista `/products` soportan `limit`, `page`, `query` (filtro por categoría) y `sort` (orden por precio).
* **Visualización Profesional**: Interfaz basada en cards con estilos modernos, sombras y botones interactivos.
* **Detalle de Producto**: Ruta específica para ver la descripción técnica de cada componente.

### 2. Gestión de Carritos (Carts)
* **Persistencia Completa**: Los carritos se guardan en MongoDB Atlas.
* **Lógica de Agregado**: El sistema verifica si un producto ya existe en el carrito para incrementar su cantidad o agregarlo como nuevo.
* **Populate**: Implementación de `.populate()` para obtener la información completa de los productos al consultar un carrito.
* **CRUD de Carritos**: Endpoints para eliminar productos específicos, actualizar cantidades o vaciar el carrito por completo.

---

## ⚙️ Instrucciones para el Evaluador

Para ejecutar este proyecto en su entorno local y verificar las funcionalidades, siga estos pasos:

1. **Instalar dependencias**:
   Abra una terminal en la raíz del proyecto y ejecute:
   ```bash
   npm install