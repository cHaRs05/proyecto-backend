console.log("✅ Script de carrito cargado y listo");

const CART_ID = "694b5b5a2f56163bc935d758"; 

async function agregarProducto(productId) {
    console.log("Intentando agregar producto:", productId);
    try {
        const response = await fetch(`/api/carts/${CART_ID}/product/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.status === "success") {
            alert("✅ ¡Producto añadido al carrito!");
        } else {
            alert("❌ Error: " + result.error);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Error al conectar con el servidor");
    }
}