// Security & Mock Utilities
const Security = {
    csrfToken: 'CSRF-' + Math.random().toString(36).substr(2, 9),
    rateLimitMap: new Map(),
    
    checkRateLimit(action, limit = 5, window = 60000) {
        const now = Date.now();
        const records = this.rateLimitMap.get(action) || [];
        const recentRecords = records.filter(time => now - time < window);
        if (recentRecords.length >= limit) return false;
        recentRecords.push(now);
        this.rateLimitMap.set(action, recentRecords);
        return true;
    },

    getFingerprint() {
        return btoa(navigator.userAgent + screen.width + screen.height);
    }
};

// Roles Definition
const ROLES = {
    CLIENTE: 'cliente',
    NEGOCIO: 'negocio',
    ADMIN: 'admin',
    ENCARGADO: 'encargado'
};

const Auth = {
    currentUser: null,
    
    login(identifier, password, type = 'email') {
        // Multi-channel auth simulation (correo, telefono, username)
        if (!Security.checkRateLimit('login')) {
            throw new Error('Demasiados intentos. Intente más tarde (Rate Limiting)');
        }

        console.log(`Autenticando via ${type}: ${identifier}`);
        
        // Mocked successful login based on identifier for demo
        let role = ROLES.CLIENTE;
        if (identifier.includes('admin')) role = ROLES.ADMIN;
        if (identifier.includes('negocio')) role = ROLES.NEGOCIO;
        if (identifier.includes('staff')) role = ROLES.ENCARGADO;

        this.currentUser = {
            id: 'USR-' + Math.random().toString(36).substr(2, 5),
            username: identifier.split('@')[0],
            role: role,
            level: 1,
            xp: 0,
            vip: 'normal', // normal, vip, superVIP
            fingerprint: Security.getFingerprint(),
            token: Security.csrfToken
        };

        localStorage.setItem('mazel_user', JSON.stringify(this.currentUser));
        return this.currentUser;
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('mazel_user');
        location.reload();
    },

    checkAuth() {
        const saved = localStorage.getItem('mazel_user');
        if (saved) {
            this.currentUser = JSON.parse(saved);
            return true;
        }
        return false;
    }
};

window.Auth = Auth;
window.ROLES = ROLES;
window.Security = Security;
