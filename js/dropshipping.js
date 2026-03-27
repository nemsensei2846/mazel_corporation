const DropshippingModule = {
    providers: [
        { id: 'prov-1', name: 'Global Direct', rating: 4.8, shippingDays: '7-12', baseCurrency: 'USD' },
        { id: 'prov-2', name: 'Express Source', rating: 4.5, shippingDays: '5-8', baseCurrency: 'USD' },
        { id: 'prov-3', name: 'Local Fast', rating: 4.9, shippingDays: '1-3', baseCurrency: 'COP' }
    ],

    winningProducts: [
        { id: 'win-1', name: 'Proyector 4K Portátil', basePrice: 45.0, suggestedPrice: 120.0, trend: 'high', margin: '62%', providerId: 'prov-1' },
        { id: 'win-2', name: 'Humidificador Volcánico', basePrice: 12.0, suggestedPrice: 35.0, trend: 'medium', margin: '65%', providerId: 'prov-2' },
        { id: 'win-3', name: 'Licuadora USB Recargable', basePrice: 15.0, suggestedPrice: 45.0, trend: 'high', margin: '66%', providerId: 'prov-3' }
    ],

    // Simulation of stock sync with external provider
    async syncStock(productId) {
        console.log(`Sincronizando stock externo para: ${productId}...`);
        return new Promise(resolve => {
            setTimeout(() => {
                const stock = Math.floor(Math.random() * 500);
                resolve({ success: true, currentStock: stock, lastSync: new Date().toISOString() });
            }, 1000);
        });
    },

    importToStore(productId, storeId) {
        const product = this.winningProducts.find(p => p.id === productId);
        if (!product) return null;

        return InventoryModule.addProduct({
            name: product.name,
            price: product.suggestedPrice,
            category: 'Dropshipping',
            internalStock: 0, // In dropshipping, internal is 0
            publicStock: 100, // External provider stock
            storeId: storeId,
            status: 'published',
            metadata: {
                isDropshipping: true,
                providerId: product.providerId,
                baseCost: product.basePrice
            }
        });
    }
};

window.DropshippingModule = DropshippingModule;
