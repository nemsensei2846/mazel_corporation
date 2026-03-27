const MarketplaceModule = {
    // Persistent Cart per Business
    cart: {
        items: [], // { productId, storeId, quantity, price, name }
        total: 0,
        id: 'CART-' + Date.now(),
        updatedAt: new Date().toISOString()
    },

    loadCart() {
        const saved = localStorage.getItem('mazel_cart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
        return this.cart;
    },

    saveCart() {
        this.cart.updatedAt = new Date().toISOString();
        localStorage.setItem('mazel_cart', JSON.stringify(this.cart));
    },

    addToCart(product, quantity = 1) {
        const existingItem = this.cart.items.find(i => i.productId === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.items.push({
                productId: product.id,
                storeId: product.storeId,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }
        this.calculateTotal();
        this.saveCart();
    },

    calculateTotal() {
        this.cart.total = this.cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        return this.cart.total;
    },

    // Order Flow with States
    orderStates: {
        PENDING: 'pendiente',
        CONFIRMED: 'confirmado',
        PREPARING: 'preparando',
        SHIPPED: 'enviado',
        DELIVERED: 'entregado',
        CANCELLED: 'cancelado'
    },

    createOrder(userId) {
        const order = {
            id: 'ORD-' + Date.now(),
            userId: userId,
            items: [...this.cart.items],
            total: this.cart.total,
            status: this.orderStates.PENDING,
            timestamp: new Date().toISOString(),
            idempotencyKey: 'IDEM-' + Math.random().toString(36).substr(2, 9),
            fingerprint: Security.getFingerprint()
        };
        
        // Reset cart after order
        this.cart.items = [];
        this.cart.total = 0;
        this.saveCart();

        return order;
    },

    // Global Search & Filters
    search(query, filters = {}) {
        let results = InventoryModule.products;

        if (query) {
            const q = query.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.description.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }

        if (filters.minPrice) {
            results = results.filter(p => p.price >= filters.minPrice);
        }

        if (filters.maxPrice) {
            results = results.filter(p => p.price <= filters.maxPrice);
        }

        if (filters.storeId) {
            results = results.filter(p => p.storeId === filters.storeId);
        }

        return results;
    }
};

window.MarketplaceModule = MarketplaceModule;
