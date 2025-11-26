const socket = io();
const productList = document.getElementById('productList');
const addForm = document.getElementById('addProductForm');
const deleteForm = document.getElementById('deleteProductForm');
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados recibidos por Socket:', products);
    renderProducts(products);
});

const renderProducts = (products) => {
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<li class="text-gray-500 italic">No hay productos disponibles.</li>';
        return;
    }

    products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.className = 'border-b border-gray-200 py-2 flex justify-between items-center';
        listItem.innerHTML = `
            <span class="text-gray-800 font-medium">
                ${product.title} 
                <span class="text-sm text-gray-500">($${product.price})</span>
            </span>
            <span class="text-xs text-gray-400">ID: ${product.id.substring(0, 8)}...</span>
        `;
        productList.appendChild(listItem);
    });
};

// 1. Formulario de Añadir Producto
addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newProduct = {
        title: addForm.title.value,
        description: addForm.description.value,
        code: addForm.code.value,
        price: parseFloat(addForm.price.value),
        stock: parseInt(addForm.stock.value),
        category: addForm.category.value
    };
    
    console.log('Emitiendo nuevo producto:', newProduct);
    socket.emit('addProduct', newProduct);

    addForm.reset();
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const productIdToDelete = deleteForm.productId.value;
    
    if (productIdToDelete) {
        console.log('Emitiendo eliminación de producto con ID:', productIdToDelete);
        socket.emit('deleteProduct', productIdToDelete);
        deleteForm.reset();
    }
});