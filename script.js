document.addEventListener('DOMContentLoaded', () => {
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    const contentArea = document.getElementById('content-area');
    const navLinks = document.querySelectorAll('.nav-link:not(.has-submenu > .nav-link)');
    const submenuLinks = document.querySelectorAll('.submenu li a');

    // Submenu Toggling Logic
    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle current submenu
            const wasActive = item.classList.contains('active');
            
            // Close other submenus (optional, for accordion effect)
            hasSubmenuItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // Function to clear all active classes from main nav links
    const clearActiveLinks = () => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
    };

    // Simple Content Switching (Client-side Simulation)
    const updateContent = (sectionId, sourceElement) => {
        clearActiveLinks();
        if (sourceElement && sourceElement.classList.contains('nav-link')) {
            sourceElement.classList.add('active');
        } else if (sourceElement && sourceElement.closest('.has-submenu')) {
             sourceElement.closest('.has-submenu').querySelector('.nav-link').classList.add('active');
        }
        // Here you would normally fetch data or load a component
        // For this demo, we'll just update the title and some placeholder text
        const titles = {
            'configuracion': 'Configuración del Negocio',
            'dashboard': 'Dashboard de Ventas',
            'productos': 'Gestión de Productos',
            'pedidos': 'Listado de Pedidos',
            'bodega': 'Inventario y Bodega',
            'caja': 'Punto de Venta / Caja',
            'reportes': 'Reportes y Analítica',
            'quienes-somos': 'Sobre Nosotros',
            'panel': 'Mi Panel Principal',
            'social': 'Mi Red Social'
        };

        const title = titles[sectionId] || 'Sección en construcción';
        
        contentArea.innerHTML = `
            <div class="welcome-section">
                <h1>${title}</h1>
                <p>Estás visualizando la sección de <strong>${title}</strong>. Aquí podrás gestionar todas las funciones relacionadas con esta área de tu negocio.</p>
            </div>
            
            <div class="placeholder-content" style="padding: 50px; text-align: center; background: #fff; border-radius: 12px; border: 2px dashed #eee;">
                <i class="fas fa-tools" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
                <p style="color: #999;">Esta sección está lista para ser conectada con tu base de datos y lógica de negocio.</p>
            </div>
        `;
    };

    // Listen for submenu link clicks
    submenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            updateContent(section, link);
            
            // Highlight active link in submenu
            submenuLinks.forEach(l => l.style.fontWeight = 'normal');
            link.style.fontWeight = 'bold';
        });
    });

    // Listen for main menu link clicks (Panel and Social)
    const panelLink = document.getElementById('link-panel');
    panelLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearActiveLinks();
        panelLink.classList.add('active');
        location.reload(); 
    });

    const socialLink = document.getElementById('link-social');
    socialLink.addEventListener('click', (e) => {
        e.preventDefault();
        updateContent('social', socialLink);
    });
});
