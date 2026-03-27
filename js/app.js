document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State & Modules
    const appState = {
        currentPage: 'marketplace',
        user: null,
        cart: MarketplaceModule.loadCart()
    };

    // 2. UI Elements
    const contentArea = document.getElementById('content-area');
    const authOverlay = document.getElementById('auth-overlay');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userOrdersBtn = document.getElementById('user-orders-btn');
    const cartIcon = document.getElementById('cart-btn-nav');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalDisplay = document.getElementById('cart-total-display');
    const cartCount = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const productModal = document.getElementById('product-modal');
    const closeProduct = document.getElementById('close-product');
    const productDetailContainer = document.getElementById('product-detail-container');
    const categoriesListDropdown = document.getElementById('categories-list-dropdown');
    const searchInputHeader = document.getElementById('market-search-header');
    const searchBtnHeader = document.getElementById('btn-search-header');

    // 3. Navigation Logic
    const navigate = (pageId, params = {}) => {
        appState.currentPage = pageId;
        renderPage(pageId, params);
        
        // Update nav active state
        document.querySelectorAll('.main-nav-links a').forEach(l => l.style.borderColor = 'transparent');
        const activeLink = document.querySelector(`[data-page="${pageId}"], [onclick*="renderPage('${pageId}')"]`);
        if (activeLink) {
            activeLink.style.borderColor = 'white';
        }
        
        // Populate categories dropdown if empty
        if (categoriesListDropdown && categoriesListDropdown.children.length === 0) {
            categoriesListDropdown.innerHTML = InventoryModule.categories.map(cat => 
                `<a href="#" onclick="renderPage('marketplace', {category: '${cat}'})">${cat}</a>`
            ).join('');
        }
    };

    // 4. Page Renderers
    window.renderPage = (pageId, params) => {
        let html = '';
        switch(pageId) {
            case 'marketplace': html = renderMarketplace(params); break;
            case 'negocio': html = renderBusinessDashboard(); break;
            case 'productos': html = renderInventory(); break;
            case 'pedidos': html = renderOrders(); break;
            case 'caja': html = renderCash(); break;
            case 'reportes': html = renderReports(); break;
            case 'perfil': html = renderUserProfile(); break;
            case 'admin': html = renderAdminPanel(); break;
            case 'dropshipping': html = renderDropshippingCenter(); break;
            case 'quienes-somos': html = renderAboutUs(); break;
            case 'red-social': html = renderSocial(); break;
            default: html = `<h1>404</h1><p>Sección en construcción</p>`;
        }
        contentArea.innerHTML = html;
        attachPageEvents(pageId);
    };

    const renderMarketplace = (filters = {}) => {
        const products = MarketplaceModule.search(filters.query, filters);
        const categories = InventoryModule.categories.slice(0, 15); // Show top 15
        
        // Icons for categories to make it more visual
        const catIcons = {
            'Electrónica': 'fas fa-laptop',
            'Hogar': 'fas fa-couch',
            'Moda': 'fas fa-tshirt',
            'Belleza': 'fas fa-magic',
            'Deportes': 'fas fa-running',
            'Juguetes': 'fas fa-gamepad',
            'Libros': 'fas fa-book',
            'Automotriz': 'fas fa-car',
            'Herramientas': 'fas fa-tools',
            'Mascotas': 'fas fa-paw',
            'Bienes y Raíces': 'fas fa-building',
            'Alimentos': 'fas fa-utensils',
            'Muebles': 'fas fa-chair',
            'Dropshipping': 'fas fa-truck-loading'
        };

        return `
            <div class="hero-carousel" id="hero-carousel">
                <div class="carousel-container">
                    <div class="carousel-slide active" style="background-image: url('fotos/61Qh1c7UrpL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/71IbaDTgWOL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/71LjdfPosVL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/71Qeq7Q-qrL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/71qnSkjYKxL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/81Fea-WcJuL._SX3000_.jpg');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/D_NQ_825458-MLA108879204031_032026-OO.webp');"></div>
                    <div class="carousel-slide" style="background-image: url('fotos/D_NQ_904561-MLA108103447382_032026-OO.webp');"></div>
                </div>
                <div class="carousel-overlay"></div>
                <div class="hero-content">
                    <h1 style="font-size: 3.5rem; font-weight: 800; line-height: 1.1;">
                        <span style="font-weight: 900; letter-spacing: -2px;">MAZEL</span> lo puedes encontrar todo en uno
                    </h1>
                </div>
            </div>

            <!-- Mercado Libre Style Info Cards -->
            <div class="info-cards-section">
                <div class="info-card" style="animation-delay: 0.1s;">
                    <div class="info-card-icon" style="color: #ffda00;"><i class="fas fa-user-circle"></i></div>
                    <h4>Ingresa a tu cuenta</h4>
                    <p>Disfruta de ofertas y compra sin límites.</p>
                    <a href="#" class="info-card-link" onclick="showAuth()">Ingresar a tu cuenta</a>
                </div>
                <div class="info-card" style="animation-delay: 0.2s;">
                    <div class="info-card-icon" style="color: #3483fa;"><i class="fas fa-map-marker-alt"></i></div>
                    <h4>Ingresa tu ubicación</h4>
                    <p>Consulta costos y tiempos de entrega.</p>
                    <a href="#" class="info-card-link">Ingresar ubicación</a>
                </div>
                <div class="info-card" style="animation-delay: 0.3s;">
                    <div class="info-card-icon" style="color: #00a650;"><i class="fas fa-tags"></i></div>
                    <h4>Menos de $100</h4>
                    <p>Descubre productos con precios bajos.</p>
                    <a href="#" class="info-card-link" onclick="renderPage('marketplace', {maxPrice: 100})">Mostrar productos</a>
                </div>
                <div class="info-card" style="animation-delay: 0.4s;">
                    <div class="info-card-icon" style="color: #ff8100;"><i class="fas fa-fire"></i></div>
                    <h4>Más vendidos</h4>
                    <p>Explora los productos que son tendencia.</p>
                    <a href="#" class="info-card-link">Ir a Más vendidos</a>
                </div>
                <div class="info-card" style="animation-delay: 0.5s;">
                    <div class="info-card-icon" style="color: #3483fa;"><i class="fas fa-shield-alt"></i></div>
                    <h4>Compra protegida</h4>
                    <p>Puedes devolver tu compra gratis.</p>
                    <a href="#" class="info-card-link">Cómo funciona</a>
                </div>
                <div class="info-card" style="animation-delay: 0.6s;">
                    <div class="info-card-icon" style="color: #ffda00;"><i class="fas fa-store"></i></div>
                    <h4>Tiendas oficiales</h4>
                    <p>Encuentra tus marcas preferidas.</p>
                    <a href="#" class="info-card-link">Mostrar tiendas</a>
                </div>
            </div>

            <div class="promo-text-section animate-fade">
                <h2>Encuentra los mejores productos y gestiona tu negocio como un profesional.</h2>
            </div>

            <div style="padding: 20px;">
                <div class="search-bar animate-fade" style="margin-bottom: 30px; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; box-shadow: var(--shadow-md); border-radius: 8px; overflow: hidden;">
                    <input type="text" id="market-search" placeholder="Buscar en Mazel Pro..." value="${filters.query || ''}" style="padding: 15px;">
                    <button id="btn-search-market" style="background: var(--accent-color); width: 60px;"><i class="fas fa-search"></i></button>
                </div>
                
                <div class="marketplace-grid">
                    ${products.length > 0 ? products.map((p, index) => `
                        <div class="product-card" style="animation-delay: ${index * 0.05}s">
                            <div class="product-image" onclick="showProductDetailUI('${p.id}')" style="cursor: pointer;">
                                <i class="fas fa-box" style="font-size: 4rem; color: #eee;"></i>
                            </div>
                            <div class="product-info">
                                ${p.metadata?.isDropshipping ? `
                                    <div class="badge-dropshipping">
                                        <i class="fas fa-truck-moving"></i> Envío Directo
                                    </div>
                                ` : ''}
                                <span class="product-category" style="color: #565959; font-size: 0.75rem;">${p.category}</span>
                                <h3 onclick="showProductDetailUI('${p.id}')">${p.name}</h3>
                                <div style="color: #ffa41c; font-size: 0.8rem; margin-bottom: 5px;">
                                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                                    <span style="color: #007185; margin-left: 5px;">4.5</span>
                                </div>
                                <p class="product-price"><span style="font-size: 0.8rem; vertical-align: super; margin-right: 2px;">$</span>${Math.floor(p.price)}<span style="font-size: 0.8rem; vertical-align: super;">${(p.price % 1).toFixed(2).substring(2)}</span></p>
                                ${p.metadata?.isDropshipping ? `
                                    <div class="shipping-estimate">Llega en 5-8 días hábiles</div>
                                ` : ''}
                                <button class="btn-buy" style="margin-top: 10px;" onclick="addToCartUI('${p.id}')">Añadir al carrito</button>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="empty-state animate-fade">
                            <i class="fas fa-search" style="font-size: 4rem; color: #ddd;"></i>
                            <p style="font-size: 1.2rem; margin: 20px 0;">No encontramos resultados para tu búsqueda.</p>
                            <button class="btn-buy" onclick="renderPage('marketplace')" style="width: auto; padding: 10px 30px;">Ver todos los productos</button>
                        </div>
                    `}
                </div>
            </div>
        `;
    };

    window.showProductDetailUI = (productId) => {
        const p = InventoryModule.products.find(prod => prod.id === productId);
        if (!p) return;
        
        productDetailContainer.innerHTML = `
            <div style="display: flex; gap: 40px;">
                <div style="flex: 1; background: #f8f9fa; border-radius: 12px; height: 400px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-box" style="font-size: 8rem; color: #ddd;"></i>
                </div>
                <div style="flex: 1;">
                    <span class="product-category">${p.category}</span>
                    <h1 style="font-size: 2rem; margin: 10px 0;">${p.name}</h1>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                        <div style="color: #f1c40f;">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                        </div>
                        <span style="color: #777; font-size: 0.9rem;">(128 calificaciones)</span>
                    </div>
                    <p style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color); margin-bottom: 20px;">$${p.price.toFixed(2)}</p>
                    <p style="color: #555; line-height: 1.6; margin-bottom: 30px;">
                        Este producto de alta calidad está disponible para envío inmediato. 
                        Garantía de Mazel Pro por 12 meses. Vendedor verificado.
                    </p>
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-buy" style="padding: 15px;" onclick="addToCartUI('${p.id}'); productModal.style.display='none';">Añadir al Carrito</button>
                        <a href="${BusinessModule.createWhatsAppLink('5730000000', `Hola! Me interesa el producto: ${p.name}`)}" target="_blank" class="btn-whatsapp" style="margin: 0; padding: 0 20px;">
                            <i class="fab fa-whatsapp"></i> Preguntar
                        </a>
                    </div>
                </div>
            </div>
        `;
        productModal.style.display = 'flex';
    };

    window.scrollCarousel = (distance) => {
        const carousel = document.getElementById('category-carousel');
        if (carousel) {
            carousel.scrollBy({ left: distance, behavior: 'smooth' });
        }
    };

    const renderBusinessDashboard = () => {
        if (!appState.user || appState.user.role !== ROLES.NEGOCIO) return accessDenied();
        const metrics = BusinessModule.getMetrics();
        const plan = BusinessModule.plans[appState.user.vip];
        return `
            <div class="welcome-section">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h1>Panel de Negocio: ${appState.user.username}</h1>
                    <span class="level-badge" style="background: ${plan.color}">${plan.name}</span>
                </div>
                <p>Gestiona tu tienda y ventas.</p>
            </div>
            <div class="stats-grid">
                <div class="stat-card"><h3>Balance Actual</h3><p class="stat-value">$${metrics.balance.toFixed(2)}</p></div>
                <div class="stat-card"><h3>Ventas Totales</h3><p class="stat-value">$${metrics.ingresos.toFixed(2)}</p></div>
                <div class="stat-card"><h3>Gastos</h3><p class="stat-value">$${metrics.egresos.toFixed(2)}</p></div>
                <div class="stat-card"><h3>Productos</h3><p class="stat-value">${InventoryModule.getStoreInventory(appState.user.id).length} / ${plan.limit}</p></div>
            </div>
            <div class="report-grid">
                <div class="recent-activity">
                    <h2>Configuración WhatsApp</h2>
                    <div class="form-group">
                        <label>Tu número de WhatsApp</label>
                        <input type="text" class="form-control" placeholder="+57 300 000 0000">
                    </div>
                    <a href="${BusinessModule.createWhatsAppLink('5730000000', 'Hola!')}" target="_blank" class="btn-whatsapp">
                        <i class="fab fa-whatsapp"></i> Probar Conexión
                    </a>
                </div>
                <div class="recent-activity">
                    <h2>Próximos Pasos</h2>
                    <ul style="padding-left: 20px; line-height: 2;">
                        <li>Sube 5 productos más para desbloquear XP</li>
                        <li>Configura tu pasarela de pagos</li>
                        <li>Personaliza el diseño de tu tienda</li>
                    </ul>
                </div>
            </div>
        `;
    };

    const renderInventory = () => {
        if (!appState.user) return accessDenied();
        const storeId = appState.user.id;
        const inventory = InventoryModule.getStoreInventory(storeId);
        return `
            <div class="welcome-section" style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div><h1>Gestión de Inventario</h1><p>Control de stock interno vs público.</p></div>
                <button class="btn-buy" id="add-product-btn" style="width: auto; padding: 10px 25px;">+ Nuevo Producto</button>
            </div>
            <div class="recent-activity">
                <table>
                    <thead>
                        <tr><th>Producto</th><th>Categoría</th><th>Interno</th><th>Público</th><th>Precio</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                        ${inventory.map(p => `
                            <tr>
                                <td><strong>${p.name}</strong></td>
                                <td>${p.category}</td>
                                <td><span class="status-badge status-internal">${p.internalStock}</span></td>
                                <td><span class="status-badge status-public">${p.publicStock}</span></td>
                                <td>$${p.price.toFixed(2)}</td>
                                <td><span class="status-badge ${p.status === 'published' ? 'completed' : 'pending'}">${p.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    const renderCash = () => {
        if (!appState.user || appState.user.role !== ROLES.NEGOCIO) return accessDenied();
        const metrics = BusinessModule.getMetrics();
        return `
            <div class="welcome-section"><h1>Caja (Ingresos / Egresos)</h1><p>Control financiero de tu negocio.</p></div>
            <div class="report-grid">
                <div class="recent-activity">
                    <h2>Registrar Movimiento</h2>
                    <form id="cash-form">
                        <div class="form-group"><label>Monto</label><input type="number" id="cash-amount" class="form-control" required></div>
                        <div class="form-group"><label>Tipo</label>
                            <select id="cash-type" class="form-control"><option value="ingreso">Ingreso</option><option value="egreso">Egreso</option></select>
                        </div>
                        <div class="form-group"><label>Motivo</label><input type="text" id="cash-reason" class="form-control" required></div>
                        <button type="submit" class="btn-buy">Registrar</button>
                    </form>
                </div>
                <div class="recent-activity">
                    <h2>Historial Reciente</h2>
                    <div style="max-height: 300px; overflow-y: auto;">
                        <table style="font-size: 0.85rem;">
                            <tbody>
                                ${BusinessModule.cashLog.map(m => `
                                    <tr>
                                        <td>${new Date(m.timestamp).toLocaleTimeString()}</td>
                                        <td style="color: ${m.type === 'ingreso' ? 'green' : 'red'}">${m.type === 'ingreso' ? '+' : '-'}$${m.amount}</td>
                                        <td>${m.reason}</td>
                                    </tr>
                                `).reverse().join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    };

    const renderDropshippingCenter = () => {
        if (!appState.user || appState.user.role !== ROLES.NEGOCIO) return accessDenied();
        
        return `
            <div class="welcome-section">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h1>Centro de Dropshipping 🚀</h1>
                    <span class="level-badge" style="background: #2ecc71;">Sincronizado</span>
                </div>
                <p>Encuentra productos ganadores (Winning Products) e impórtalos a tu tienda con un clic.</p>
            </div>

            <div class="report-grid">
                <!-- Top Providers -->
                <div class="recent-activity">
                    <h2>Proveedores Verificados</h2>
                    ${DropshippingModule.providers.map(prov => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                            <div>
                                <div style="font-weight: 600;">${prov.name}</div>
                                <div style="font-size: 0.75rem; color: #777;">Envío: ${prov.shippingDays} días | Rating: ${prov.rating} ⭐</div>
                            </div>
                            <button class="btn-buy" style="width: auto; font-size: 0.7rem; padding: 5px 10px;">Contactar</button>
                        </div>
                    `).join('')}
                </div>

                <!-- Trending Stats -->
                <div class="recent-activity">
                    <h2>Métricas de Tendencia</h2>
                    <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                        <div class="stat-card" style="margin: 0;"><h3>Productos en Tendencia</h3><p class="stat-value">1,245</p></div>
                        <div class="stat-card" style="margin: 0;"><h3>Volumen Global 24h</h3><p class="stat-value">$42,500.00</p></div>
                    </div>
                </div>
            </div>

            <h2 style="margin: 40px 0 20px;">🔥 Productos Ganadores del Día</h2>
            <div class="marketplace-grid" style="padding: 0;">
                ${DropshippingModule.winningProducts.map(wp => `
                    <div class="product-card">
                        <div class="product-image"><i class="fas fa-fire" style="font-size: 3rem; color: #ff4d4d;"></i></div>
                        <div class="product-info">
                            <span class="level-badge" style="background: #ff4d4d; margin-bottom: 5px;">Trend: ${wp.trend.toUpperCase()}</span>
                            <h3>${wp.name}</h3>
                            <div style="margin: 10px 0;">
                                <div style="font-size: 0.8rem; color: #777;">Costo base: $${wp.basePrice.toFixed(2)}</div>
                                <div style="font-size: 1rem; font-weight: bold; color: var(--success);">Margen: ${wp.margin}</div>
                            </div>
                            <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 15px;">Precio Sugerido: $${wp.suggestedPrice.toFixed(2)}</div>
                            <button class="btn-buy" onclick="importProductUI('${wp.id}')" style="width: 100%;">Importar a mi Tienda</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    window.importProductUI = (productId) => {
        const product = DropshippingModule.importToStore(productId, appState.user.id);
        if (product) {
            alert(`¡Éxito! "${product.name}" ha sido importado a tu inventario.`);
            GamificationModule.awardXp(appState.user, 'new_store');
            updateUIForUser();
            navigate('productos');
        }
    };

    const renderUserProfile = () => {
        if (!appState.user) return accessDenied();
        const u = appState.user;
        const lvl = GamificationModule.calculateLevel(u.xp);
        return `
            <div class="profile-header">
                <div class="profile-avatar-large">${u.username.substr(0, 2).toUpperCase()}</div>
                <div>
                    <h1 style="margin-bottom: 5px;">Hola, ${u.username}!</h1>
                    <p style="opacity: 0.8;">${u.role.toUpperCase()} | Miembro desde hoy</p>
                    <div style="margin-top: 15px;"><span class="level-badge" style="background: white; color: var(--primary-color)">${lvl.title} (Nivel ${u.level})</span></div>
                </div>
            </div>
            <div class="report-grid">
                <div class="recent-activity">
                    <h2>Tu Progreso</h2>
                    <p>Faltan <strong>${(GamificationModule.levels[u.level] || lvl).minXp - u.xp} XP</strong> para el siguiente nivel.</p>
                    <div class="xp-container" style="height: 20px;"><div class="xp-bar" style="width: ${((u.xp - lvl.minXp) / ((GamificationModule.levels[u.level]?.minXp || lvl.minXp + 500) - lvl.minXp)) * 100}%"></div></div>
                </div>
                <div class="recent-activity">
                    <h2>Beneficios VIP</h2>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: green;"></i> Soporte prioritario</li>
                        <li style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: green;"></i> Acceso a marketplace global</li>
                        <li style="opacity: 0.5;"><i class="fas fa-lock"></i> Comisiones reducidas (Nivel 5)</li>
                    </ul>
                </div>
            </div>
        `;
    };

    const renderAboutUs = () => `
        <div class="welcome-section"><h1>Quiénes Somos</h1><p>La plataforma definitiva para el comercio moderno.</p></div>
        <div class="recent-activity" style="line-height: 1.8; font-size: 1.1rem;">
            <p>Mazel es un ecosistema diseñado para empoderar a emprendedores y negocios locales. Combinamos la robustez de un sistema de gestión empresarial (ERP) con la visibilidad de un marketplace global.</p>
            <h3 style="margin-top: 20px;">Nuestra Misión</h3>
            <p>Simplificar el comercio digital mediante herramientas de seguridad avanzada, gamificación y automatización, permitiendo que cualquier negocio crezca sin límites técnicos.</p>
        </div>
    `;

    const renderSocial = () => {
        const posts = [
            { user: 'TecnoStore', content: '¡Nueva llegada de iPhone 15 Pro! 📱 Envío gratis hoy.', likes: 24, comments: 5 },
            { user: 'MariaG', content: 'Acabo de recibir mi pedido de Mazel, ¡excelente servicio! ⭐⭐⭐⭐⭐', likes: 12, comments: 2 },
            { user: 'AdminMazel', content: '¡Bienvenidos a la nueva red social para negocios! 🚀 #MazelPro', likes: 150, comments: 45 }
        ];
        
        return `
            <div class="welcome-section">
                <h1>Red Social Mazel</h1>
                <p>Conecta, comparte y crece con otros miembros de la comunidad.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
                <div>
                    <!-- Post Creator -->
                    <div class="recent-activity" style="margin-bottom: 20px;">
                        <textarea class="form-control" placeholder="¿Qué quieres compartir hoy?" style="resize: none; height: 100px; margin-bottom: 10px;"></textarea>
                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn-buy" style="width: auto; padding: 10px 30px;">Publicar</button>
                        </div>
                    </div>
                    
                    <!-- Feed -->
                    ${posts.map(post => `
                        <div class="recent-activity" style="margin-bottom: 20px;">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                <div class="user-avatar" style="width: 35px; height: 35px; font-size: 0.8rem;">${post.user.substr(0,2)}</div>
                                <strong>${post.user}</strong>
                                <span style="color: #999; font-size: 0.8rem; margin-left: auto;">Hace 2h</span>
                            </div>
                            <p style="margin-bottom: 15px;">${post.content}</p>
                            <div style="display: flex; gap: 20px; color: #777; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 10px;">
                                <span><i class="far fa-thumbs-up"></i> ${post.likes}</span>
                                <span><i class="far fa-comment"></i> ${post.comments}</span>
                                <span><i class="fas fa-share"></i> Compartir</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <aside>
                    <div class="recent-activity">
                        <h3>Tendencias</h3>
                        <ul style="list-style: none; padding: 0; margin-top: 15px; line-height: 2.5;">
                            <li><a href="#" style="color: var(--accent-color); font-weight: 600;">#MazelSale</a></li>
                            <li><a href="#" style="color: var(--accent-color); font-weight: 600;">#Emprendedores</a></li>
                            <li><a href="#" style="color: var(--accent-color); font-weight: 600;">#BlackFriday</a></li>
                        </ul>
                    </div>
                </aside>
            </div>
        `;
    };

    const renderOrders = () => {
        if (!appState.user) return accessDenied();
        return `
            <div class="welcome-section"><h1>Pedidos</h1><p>Seguimiento de tus compras y ventas.</p></div>
            <div class="empty-state"><i class="fas fa-shopping-bag"></i><p>No tienes pedidos registrados aún.</p></div>
        `;
    };

    const renderReports = () => {
        if (!appState.user || appState.user.role !== ROLES.NEGOCIO) return accessDenied();
        return `
            <div class="welcome-section"><h1>Reportes y Analítica</h1><p>Métricas avanzadas de tu desempeño.</p></div>
            <div class="report-grid">
                <div class="recent-activity"><h3>Ventas por Categoría</h3><div class="chart-placeholder">Gráfico de Ventas</div></div>
                <div class="recent-activity"><h3>Crecimiento Semanal</h3><div class="chart-placeholder">Gráfico de Crecimiento</div></div>
            </div>
        `;
    };

    const renderAdminPanel = () => {
        if (!appState.user || appState.user.role !== ROLES.ADMIN) return accessDenied();
        return `
            <div class="welcome-section"><h1>Admin Global</h1><p>Auditoría de seguridad y control total.</p></div>
            <div class="recent-activity">
                <h2>Log de Auditoría (Fingerprinting & Idempotencia)</h2>
                <div style="max-height: 500px; overflow-y: auto;">
                    <table style="font-size: 0.8rem;">
                        <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Seguridad</th></tr></thead>
                        <tbody>
                            ${GamificationModule.eventAuditLog.map(e => `
                                <tr><td>${new Date(e.timestamp).toLocaleString()}</td><td>${e.userId}</td><td>${e.action}</td><td><code>IDEM: ${e.idempotencyKey.substr(0,8)}</code></td></tr>
                            `).reverse().join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const accessDenied = () => `<div class="empty-state"><i class="fas fa-lock"></i><h1>Acceso Denegado</h1><p>Inicia sesión con los permisos adecuados.</p></div>`;

    // 5. Cart Logic
    const updateCartUI = () => {
        const cart = MarketplaceModule.loadCart();
        cartCount.textContent = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cartTotalDisplay.textContent = `$${cart.total.toFixed(2)}`;
        
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = `<div class="empty-state"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío.</p></div>`;
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = 0.5;
        } else {
            cartItemsContainer.innerHTML = cart.items.map(i => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${i.name}</div>
                        <div class="cart-item-price">$${i.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-qty-control">
                        <button class="cart-qty-btn" onclick="updateQty('${i.productId}', -1)">-</button>
                        <span>${i.quantity}</span>
                        <button class="cart-qty-btn" onclick="updateQty('${i.productId}', 1)">+</button>
                    </div>
                </div>
            `).join('');
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = 1;
        }
    };

    window.addToCartUI = (productId) => {
        const product = InventoryModule.products.find(p => p.id === productId);
        if (product) {
            MarketplaceModule.addToCart(product);
            updateCartUI();
            if (appState.user) GamificationModule.awardXp(appState.user, 'purchase');
            updateUIForUser();
            // Show feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '¡Añadido!';
            btn.style.background = '#2ecc71';
            setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 1500);
        }
    };

    window.updateQty = (productId, delta) => {
        const cart = MarketplaceModule.loadCart();
        const item = cart.items.find(i => i.productId === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) cart.items = cart.items.filter(i => i.productId !== productId);
            MarketplaceModule.calculateTotal();
            MarketplaceModule.saveCart();
            updateCartUI();
        }
    };

    // 6. Auth Logic
    window.showAuth = () => authOverlay.style.display = 'flex';
    window.hideAuth = () => authOverlay.style.display = 'none';

    // Close auth modal if clicking outside the card
    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) hideAuth();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('auth-id').value;
        const pass = document.getElementById('auth-pass').value;
        const type = document.getElementById('auth-type').value;

        try {
            const user = Auth.login(id, pass, type);
            appState.user = user;
            updateUIForUser();
            hideAuth();
            navigate('marketplace');
        } catch (err) { alert(err.message); }
    });

    const updateUIForUser = () => {
        if (appState.user) {
            userProfileBtn.style.visibility = 'visible';
            if (userOrdersBtn) userOrdersBtn.style.visibility = 'visible';
            
            userProfileBtn.innerHTML = `
                <span class="action-sub">Hola, ${appState.user.username}</span>
                <span class="action-main">Mi Cuenta <i class="fas fa-caret-down"></i></span>
            `;
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            // Role based link visibility
            document.querySelectorAll('[data-role]').forEach(el => {
                const roles = el.getAttribute('data-role').split(',');
                el.style.display = roles.includes(appState.user.role) ? 'block' : 'none';
            });
        } else {
            userProfileBtn.style.visibility = 'hidden';
            if (userOrdersBtn) userOrdersBtn.style.visibility = 'hidden';
            
            userProfileBtn.innerHTML = `
                <span class="action-sub">Hola, Identifícate</span>
                <span class="action-main">Cuenta y Listas <i class="fas fa-caret-down"></i></span>
            `;
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    };

    const startHeroCarousel = () => {
        const carousel = document.getElementById('hero-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        if (window.heroCarouselInterval) clearInterval(window.heroCarouselInterval);
        
        window.heroCarouselInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
            
            // Re-trigger text animation
            const heroContent = carousel.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.animation = 'none';
                heroContent.offsetHeight; // trigger reflow
                heroContent.style.animation = '';
            }
        }, 5000);
    };

    const attachPageEvents = (pageId) => {
        if (pageId === 'marketplace') {
            startHeroCarousel();
            const btnSearch = document.getElementById('btn-search-market');
            const inputSearch = document.getElementById('market-search');
            const handleSearch = () => {
                renderPage('marketplace', { 
                    query: inputSearch.value,
                    minPrice: document.getElementById('min-price').value,
                    maxPrice: document.getElementById('max-price').value
                });
            };
            if (btnSearch) btnSearch.onclick = handleSearch;
            if (inputSearch) inputSearch.onkeypress = (e) => { if(e.key === 'Enter') handleSearch(); };
        }
        if (pageId === 'productos' && document.getElementById('add-product-btn')) {
            document.getElementById('add-product-btn').onclick = () => {
                const name = prompt('Nombre:'); if (!name) return;
                InventoryModule.addProduct({ name, price: 50, category: 'General', internalStock: 100, publicStock: 10, storeId: appState.user.id, status: 'published' });
                GamificationModule.awardXp(appState.user, 'new_store'); updateUIForUser(); renderPage('productos');
            };
        }
        if (pageId === 'caja' && document.getElementById('cash-form')) {
            document.getElementById('cash-form').onsubmit = (e) => {
                e.preventDefault();
                BusinessModule.addCashMovement(document.getElementById('cash-amount').value, document.getElementById('cash-type').value, document.getElementById('cash-reason').value);
                renderPage('caja');
            };
        }
    };

    // 7. Global Events
    if (cartIcon) cartIcon.onclick = () => { updateCartUI(); cartModal.style.display = 'flex'; };
    if (closeCart) closeCart.onclick = () => cartModal.style.display = 'none';
    if (closeProduct) closeProduct.onclick = () => productModal.style.display = 'none';
    
    if (searchBtnHeader) {
        searchBtnHeader.onclick = () => {
            renderPage('marketplace', { query: searchInputHeader.value });
        };
    }

    if (searchInputHeader) {
        searchInputHeader.onkeypress = (e) => {
            if (e.key === 'Enter') renderPage('marketplace', { query: searchInputHeader.value });
        };
    }
    
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            const cart = MarketplaceModule.loadCart();
            const msg = `Hola Mazel, quiero confirmar mi pedido:\n${cart.items.map(i => `- ${i.name} x${i.quantity} ($${i.price})`).join('\n')}\nTotal: $${cart.total}`;
            window.open(BusinessModule.createWhatsAppLink('5730000000', msg), '_blank');
            MarketplaceModule.createOrder(appState.user?.id || 'invitado');
            updateCartUI(); cartModal.style.display = 'none';
        };
    }

    document.addEventListener('click', (e) => {
        const navLink = e.target.closest('.main-nav-links a, .secondary-nav-links a, [data-page]');
        
        if (navLink) {
            const pageId = navLink.getAttribute('data-page');
            if (pageId) {
                e.preventDefault();
                navigate(pageId);
            }
        }
        
        if (e.target === cartModal) cartModal.style.display = 'none';
        if (e.target === productModal) productModal.style.display = 'none';
    });

    userProfileBtn.onclick = () => appState.user ? navigate('perfil') : showAuth();
    logoutBtn.onclick = () => Auth.logout();

    // Init
    if (Auth.checkAuth()) { appState.user = Auth.currentUser; updateUIForUser(); }
    navigate('marketplace');
    updateCartUI();
    
    // Seed Demo
    InventoryModule.addProduct({ id: 'p1', name: 'iPhone 15 Pro Max', price: 1299, category: 'Electrónica', internalStock: 50, publicStock: 10, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p2', name: 'MacBook Pro M3 Ultra', price: 3499, category: 'Electrónica', internalStock: 20, publicStock: 5, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p3', name: 'Sony WH-1000XM5', price: 399, category: 'Electrónica', internalStock: 100, publicStock: 30, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p4', name: 'Samsung S24 Ultra', price: 1199, category: 'Electrónica', internalStock: 40, publicStock: 15, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p5', name: 'Apple Watch Ultra 2', price: 799, category: 'Electrónica', internalStock: 30, publicStock: 10, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p6', name: 'Camiseta Premium Mazel', price: 25, category: 'Moda', internalStock: 200, publicStock: 100, storeId: 'demo', status: 'published' });
    InventoryModule.addProduct({ id: 'p7', name: 'Apartamento de Lujo - Vista al Mar', price: 250000, category: 'Bienes y Raíces', internalStock: 1, publicStock: 1, storeId: 'demo', status: 'published' });
});
