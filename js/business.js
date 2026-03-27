const BusinessModule = {
    stores: [],
    
    plans: {
        normal: { name: 'Normal', limit: 50, commission: 0.1, color: '#95a5a6' },
        vip: { name: 'VIP', limit: 200, commission: 0.05, color: '#f1c40f' },
        superVIP: { name: 'SuperVIP', limit: Infinity, commission: 0.02, color: '#e67e22' }
    },

    getStore(storeId) {
        return this.stores.find(s => s.id === storeId);
    },

    createWhatsAppLink(phone, message) {
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    },

    // Cash Management (Ingresos/Egresos)
    cashLog: [],
    addCashMovement(amount, type, reason) {
        const movement = {
            id: 'CASH-' + Date.now(),
            amount: parseFloat(amount),
            type: type, // ingreso, egreso
            reason: reason,
            timestamp: new Date().toISOString(),
            idempotencyKey: 'IDEM-' + Math.random().toString(36).substr(2, 9)
        };
        this.cashLog.push(movement);
        return movement;
    },

    getMetrics() {
        const totalIngresos = this.cashLog.filter(m => m.type === 'ingreso').reduce((sum, m) => sum + m.amount, 0);
        const totalEgresos = this.cashLog.filter(m => m.type === 'egreso').reduce((sum, m) => sum + m.amount, 0);
        return {
            balance: totalIngresos - totalEgresos,
            ingresos: totalIngresos,
            egresos: totalEgresos,
            count: this.cashLog.length
        };
    }
};

window.BusinessModule = BusinessModule;
