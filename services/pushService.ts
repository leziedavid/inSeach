import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { secureFetch } from "@/services/securityService";

/* ============================================
📌 SUBSCRIBE USER TO PUSH NOTIFICATIONS
============================================ */
export const subscribeToPushApi2 = async (data: { subscription: PushSubscription; deviceId: string; }): Promise<BaseResponse<null>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/push/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de l’abonnement aux notifications push :", error);
        throw error;
    }
};



/* ============================================
📌 SUBSCRIBE USER TO PUSH NOTIFICATIONS
============================================ */
export const subscribeToPushApi = async (data: { subscription: PushSubscriptionJSON; deviceId: string; }): Promise<BaseResponse<null>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/push/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de l’abonnement aux notifications push :", error);
        throw error;
    }
};

/* ============================================
📌 UNSUBSCRIBE USER FROM PUSH NOTIFICATIONS
============================================ */
export const unsubscribeFromPushApi = async (data: { deviceId: string; }): Promise<BaseResponse<null>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/push/unsubscribe`, { method: "POST", headers: { "Content-Type": "application/json" },  body: JSON.stringify(data), });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la désinscription push :", error);
        throw error;
    }
};

/* ============================================
📌 SEND PUSH NOTIFICATION TO ONE USER
============================================ */
export const notifyUserPush = async (data: { userId: string; deviceId: string; title: string; message: string; url?: string; }): Promise<BaseResponse<null>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/push/notify-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        return await res.json();
    } catch (error) {
        console.error("Erreur lors de l’envoi de la notification utilisateur :", error);
        throw error;
    }
};

/* ============================================
📌 SEND PUSH NOTIFICATION TO ALL USERS
============================================ */
export const notifyAllPush = async (data: { title: string; message: string; url?: string; }): Promise<BaseResponse<null>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/push/notify-all`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        return await res.json();
    } catch (error) {
        console.error("Erreur lors de l’envoi de la notification globale :", error);
        throw error;
    }
};
