'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { urlBase64ToUint8Array } from '@/utils/format';
import { getDeviceId } from '@/utils/getDeviceId';
import SubscribePrompt from '@/components/push/SubscribePrompt';
import { subscribeToPushApi, unsubscribeFromPushApi } from '@/services/pushService';

// Types
interface PushNotificationsContextType { isSupported: boolean; isSubscribed: boolean;  subscribeToPush: () => Promise<void>; unsubscribeFromPush: () => Promise<void>; loading: boolean;}

interface PushNotificationsProviderProps {
    children: React.ReactNode;
}

const PushNotificationsContext = createContext<PushNotificationsContextType>({
    isSupported: false,
    isSubscribed: false,
    subscribeToPush: async () => { },
    unsubscribeFromPush: async () => { },
    loading: false,
});

const PROMPT_DELAY = 2000; // 2 secondes

export const PushNotificationsProvider: React.FC<PushNotificationsProviderProps> = ({ children }) => {
    const [subscription, setSubscription] = useState<PushSubscriptionJSON | null>(null);
    const [isSupported, setIsSupported] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [deviceId, setDeviceId] = useState<string>('');

    const isSubscribed = !!subscription;

    // ✅ Fix hydration - attendre le montage côté client
    useEffect(() => { setIsClient(true); }, []);

    // ✅ Récupérer/générer automatiquement le deviceId
    useEffect(() => {
        if (!isClient) return;
        try { setDeviceId(getDeviceId()); }
        catch (err) { console.error('Erreur getDeviceId:', err); }
    }, [isClient]);

    // ✅ Vérifier le support Push et initialiser Service Worker
    useEffect(() => {
        if (!isClient || !deviceId) return;

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            initializeServiceWorker();
        }
    }, [isClient, deviceId]);

    // ✅ Afficher le prompt après délai si pas encore abonné
    useEffect(() => {
        if (isSupported && !subscription && deviceId) {
            const timer = setTimeout(() => setShowPrompt(true), PROMPT_DELAY);
            return () => clearTimeout(timer);
        }
    }, [isSupported, subscription, deviceId]);

    // --------------------------
    // Initialiser Service Worker
    // --------------------------
    async function initializeServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {  scope: '/',  updateViaCache: 'none',  });
            const sub = await registration.pushManager.getSubscription();
            if (sub) setSubscription(sub.toJSON());
        } catch (err) {
            console.error('Erreur init SW:', err);
        }
    }

    // --------------------------
    // Subscribe
    // --------------------------
    async function subscribeToPush() {
        if (!isSupported || loading || !deviceId) return;
        setLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
            });

            // Envoyer au backend avec JSON
            await subscribeToPushApi({ subscription: sub.toJSON(), deviceId });

            setSubscription(sub.toJSON());
            setShowPrompt(false);
        } catch (err) {
            console.error('Erreur subscription:', err);
            alert("Impossible de s'abonner aux notifications");
        } finally {
            setLoading(false);
        }
    }

    // --------------------------
    // Unsubscribe
    // --------------------------
    async function unsubscribeFromPush() {
        if (!subscription || loading || !deviceId) return;
        setLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.getSubscription();
            if (sub) await sub.unsubscribe();

            setSubscription(null);
            await unsubscribeFromPushApi({ deviceId });
        } catch (err) {
            console.error('Erreur désinscription:', err);
        } finally {
            setLoading(false);
        }
    }

    // --------------------------
    // Ne rien afficher côté serveur
    // --------------------------
    if (!isClient) return <>{children}</>;

    // --------------------------
    // Ne pas afficher si pas de deviceId
    // --------------------------
    if (!deviceId) return <>{children}</>;

    return (
        <PushNotificationsContext.Provider  value={{ isSupported, isSubscribed, subscribeToPush, unsubscribeFromPush, loading }} >
            {children}
            {showPrompt && isSupported && !subscription && (
                <SubscribePrompt onSubscribe={subscribeToPush}  onDismiss={() => setShowPrompt(false)}  loading={loading}/>
            )}
        </PushNotificationsContext.Provider>
    );
};

// --------------------------
// Hook pour l'utiliser
// --------------------------
export const usePushNotifications = () => {
    const context = useContext(PushNotificationsContext);
    if (!context) throw new Error('usePushNotifications doit être utilisé dans PushNotificationsProvider');
    return context;
};
