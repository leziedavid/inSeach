// sw.js
self.addEventListener('push', (event) => {
    console.log('[SW] PUSH EVENT REÇU', event);
    
    let data = {
        title: 'Notification',
        body: 'Nouveau message',
        url: '/',
    };
    
    if (event.data) {
        const text = event.data.text();
        console.log('[SW] Payload brut:', text);
        try {
            const json = JSON.parse(text);
            data = {
                title: json.title || data.title,
                body: json.body || text,
                url: json.url || '/',
            };
        } catch {
            data.body = text;
        }
    }
    
    console.log('[SW] Notification finale:', data);
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/mtn.jpeg',
            badge: '/mtn.jpeg',
            requireInteraction: true,
            data: { url: data.url },
            tag: 'notification-' + Date.now(), // ✅ Ajout d'un tag unique
            renotify: true, // ✅ Force la réaffichage
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[SW] NOTIFICATION CLICK', event); // ✅ Ajout de log
    
    event.notification.close();
    
    let url = event.notification?.data?.url || '/';
    
    // ✅ Construction correcte de l'URL complète
    if (!url.startsWith('http')) {
        url = new URL(url, self.location.origin).href;
    }
    
    console.log('[SW] URL à ouvrir:', url); // ✅ Log pour debug
    
    event.waitUntil(
        clients.matchAll({ 
            type: 'window', 
            includeUncontrolled: true 
        }).then((clientsArr) => {
            console.log('[SW] Clients trouvés:', clientsArr.length); // ✅ Log
            
            // ✅ Recherche d'un onglet correspondant
            for (const client of clientsArr) {
                if (client.url.startsWith(self.location.origin) && 'focus' in client) {
                    console.log('[SW] Focus sur client existant');
                    return client.focus().then(() => {
                        // ✅ Navigation vers l'URL cible
                        if (client.navigate) {
                            return client.navigate(url);
                        }
                        return client;
                    });
                }
            }
            
            // ✅ Sinon, ouvre une nouvelle fenêtre
            console.log('[SW] Ouverture nouvelle fenêtre');
            return clients.openWindow(url);
        }).catch(error => {
            console.error('[SW] Erreur lors de l\'ouverture:', error);
        })
    );
});

// ✅ Ajout : Gestion de l'activation du service worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activé');
    event.waitUntil(clients.claim());
});