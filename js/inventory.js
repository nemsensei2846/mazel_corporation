const InventoryModule = {
    // 60+ Categorias supported
    categories: [
        'Electrónica', 'Hogar', 'Moda', 'Belleza', 'Deportes', 'Juguetes', 'Libros', 'Automotriz',
        'Herramientas', 'Mascotas', 'Bienes y Raíces', 'Alimentos', 'Muebles', 'Papelería', 'Bebés', 'Salud', 'Música',
        'Videojuegos', 'Cámaras', 'Audio', 'Computación', 'Smartphones', 'Relojes', 'Calzado',
        'Accesorios', 'Jardín', 'Camping', 'Pesca', 'Ciclismo', 'Fitness', 'Arte', 'Oficina',
        'Electrodomésticos', 'Decoración', 'Iluminación', 'Limpieza', 'Seguridad', 'Software',
        'Consolas', 'Tablets', 'Monitores', 'Impresoras', 'Laptops', 'Desktops', 'Servidores',
        'Networking', 'Almacenamiento', 'Componentes', 'Periféricos', 'Energía', 'Proyectores',
        'Realidad Virtual', 'Drones', 'Robótica', 'Domótica', 'Smart Home', 'IoT', 'Wearables',
        'Salud Digital', 'E-learning', 'SaaS', 'Cloud', 'Marketing Digital', 'Finanzas'
    ],

    // Stock Separation Logic
    products: [],
    
    addProduct(data) {
        // Data format: { name, description, category, internalStock, publicStock, price, storeId, status }
        const product = {
            id: 'PROD-' + Date.now(),
            name: data.name,
            description: data.description,
            category: data.category,
            internalStock: data.internalStock || 0, // Real separation
            publicStock: data.publicStock || 0, // Real separation
            price: data.price,
            storeId: data.storeId,
            status: data.status || 'draft', // draft, published, out_of_stock
            rating: 0,
            feedbackCount: 0,
            feedbacks: [],
            createdAt: new Date().toISOString()
        };
        this.products.push(product);
        return product;
    },

    updateStock(productId, type, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return null;
        if (type === 'internal') product.internalStock += quantity;
        if (type === 'public') product.publicStock += quantity;
        return product;
    },

    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    },

    getStoreInventory(storeId) {
        return this.products.filter(p => p.storeId === storeId);
    }
};

window.InventoryModule = InventoryModule;
