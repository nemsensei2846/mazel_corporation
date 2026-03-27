const GamificationModule = {
    // XP Engine Config
    xpPerAction: {
        purchase: 100,
        review: 20,
        share: 10,
        daily_login: 5,
        new_store: 500,
        completed_order: 50
    },

    levels: [
        { level: 1, minXp: 0, title: 'Novato' },
        { level: 2, minXp: 500, title: 'Bronce' },
        { level: 3, minXp: 1500, title: 'Plata' },
        { level: 4, minXp: 4000, title: 'Oro' },
        { level: 5, minXp: 10000, title: 'Platino' },
        { level: 6, minXp: 25000, title: 'Diamante' },
        { level: 7, minXp: 60000, title: 'Élite' },
        { level: 8, minXp: 150000, title: 'Maestro' },
        { level: 9, minXp: 400000, title: 'Leyenda' },
        { level: 10, minXp: 1000000, title: 'Fundador' }
    ],

    // Anti-Abuse System & Audit Log
    eventAuditLog: [],
    
    auditEvent(userId, action, xpGained, metadata = {}) {
        const event = {
            id: 'AUD-' + Date.now(),
            userId: userId,
            action: action,
            xpGained: xpGained,
            metadata: metadata,
            timestamp: new Date().toISOString(),
            idempotencyKey: 'IDEM-' + Math.random().toString(36).substr(2, 9)
        };
        this.eventAuditLog.push(event);
        return event;
    },

    checkAbuse(userId, action, limit = 5, window = 3600000) {
        // Check if user is spamming an action for XP
        const now = Date.now();
        const userEvents = this.eventAuditLog.filter(e => 
            e.userId === userId && 
            e.action === action && 
            (now - new Date(e.timestamp).getTime()) < window
        );
        return userEvents.length >= limit;
    },

    calculateLevel(totalXp) {
        let currentLevel = this.levels[0];
        for (const lvl of this.levels) {
            if (totalXp >= lvl.minXp) {
                currentLevel = lvl;
            } else {
                break;
            }
        }
        return currentLevel;
    },

    awardXp(user, action, metadata = {}) {
        if (this.checkAbuse(user.id, action)) {
            console.warn(`Anti-Abuse: Bloqueado XP para ${user.id} por ${action}`);
            return null;
        }

        const xpToAward = this.xpPerAction[action] || 0;
        user.xp += xpToAward;
        
        const oldLevel = user.level;
        const newLvlObj = this.calculateLevel(user.xp);
        user.level = newLvlObj.level;
        user.levelTitle = newLvlObj.title;

        this.auditEvent(user.id, action, xpToAward, metadata);

        if (user.level > oldLevel) {
            console.log(`Level Up! ${user.username} es ahora ${user.levelTitle} (Nivel ${user.level})`);
            // Trigger level up animation/modal
        }

        return { xpGained: xpToAward, levelUp: user.level > oldLevel };
    }
};

window.GamificationModule = GamificationModule;
