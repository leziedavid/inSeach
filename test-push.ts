const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--enable-experimental-web-platform-features'] // pour notifications push
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000'); // ta page qui enregistre le SW

    // Vérifie la permission et demande si nécessaire
    const permission = await page.evaluate(async () => {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
        return Notification.permission;
    });

    console.log('Permission actuelle:', permission);

    // Envoie une notification test via Service Worker
    const result = await page.evaluate(async () => {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('Test Push', {
                body: 'Hello world  tdl! 👋',
                icon: '/icon.png',
                badge: '/badge.png',
                data: { url: '/' },
            });
            return 'Notification envoyée ✅';
        } else {
            return 'Service Worker non supporté ❌';
        }
    });

    console.log(result);
})();
