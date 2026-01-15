// services/securityService.ts
import { useAuthMiddleware } from "@/app/middleware";
import { BaseResponse, NeoFaceResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Appointment, Order, User } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { Register } from "@/types/Request";
import { GeoLocationResult } from "@/utils/geolocation";


const NEOFACE_BASE_URL = "https://neoface.aineo.ai/api/v2";

// secureFetch: utilisé uniquement pour routes protégées
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    await useAuthMiddleware();
    const token = localStorage.getItem("access_token") || "";
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}`, };
    return fetch(url, { ...options, headers });
};


// =====================
// secureFetchNeoFace
// utilisé UNIQUEMENT pour NeoFace (API externe)
// =====================
export const secureFetchNeoFace = async ( endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const neoFaceToken = process.env.NEXT_PUBLIC_NEOFACE_TOKEN || "B4eIhK11tBGmrsvQt6nHB3unz7mJyo2spTApCwNS2c3IUCMpsfzoTXiPqM5WLL6D";
    if (!neoFaceToken) { throw new Error("NEOFACE TOKEN manquant");}
    const headers = { ...(options.headers || {}), Authorization: `Bearer ${neoFaceToken}`,};
    return fetch(`${NEOFACE_BASE_URL}${endpoint}`, { ...options, headers, });
};


// reverse-geocode

export const reverseGeocode = async (lat: number, lng: number): Promise<any> => {
    const response = await fetch(`${getBaseUrl()}/security/reverse-geocode?lat=${lat}&lng=${lng}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    return await response.json();
};

// =====================
// LOGIN (public) — fetch
// =====================
export const login = async (login: string, password: string): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/security`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
    });
    return await response.json();
};

// reconnectUser @Post('reconnect/:id')
export const reconnectUser = async (id: string): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/security/reconnect/${id}`, {
        method: "POST", // POST correct
        headers: { "Content-Type": "application/json", },
    });

    if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`);
    }
    return await response.json();
};


// CREATION DE COMPTE (public) — fetch
export const register = async (data: Register): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await response.json();
}

// =====================
// REFRESH TOKEN (public) — fetch
// =====================
export const refreshTokens = async (token: string): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/security/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: token }),
    });
    return await response.json();
};

// =====================
// ME
// =====================
export const getMyInfo = async (): Promise<BaseResponse<User>> => {
    const response = await secureFetch(`${getBaseUrl()}/security/me`, { method: "GET" });
    return await response.json();
};

export const getMyData = async (): Promise<BaseResponse<User>> => {
    const token = localStorage.getItem("access_token") || "";
    const res = await fetch(`${getBaseUrl()}/security/me`, {
        method: "GET",
        headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`,  },
    });
    return await res.json();

};

// =====================
// LISTE PAGINÉE DES UTILISATEURS
// signature exacte demandée : (page: number, limit: number)
// =====================
export const getAllUsers = async (page: number, limit: number): Promise<BaseResponse<PaginationType<User>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const response = await secureFetch(`${getBaseUrl()}/security/listes/users${q}`, { method: "GET" });
    return await response.json();
};

// =====================
// COMMANDES UTILISATEUR CONNECTÉ (paginated)
// =====================
export const getMyOrders = async (page: number, limit: number): Promise<BaseResponse<PaginationType<Order>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const response = await secureFetch(`${getBaseUrl()}/security/listes/orders/user${q}`, { method: "GET" });
    return await response.json();
};

// =====================
// COMMANDES FOURNISSEUR CONNECTÉ (paginated)
// =====================
export const getProviderOrders = async (page: number, limit: number): Promise<BaseResponse<PaginationType<Order>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const response = await secureFetch(`${getBaseUrl()}/security/listes/orders/provider${q}`, { method: "GET" });
    return await response.json();
};

// =====================
// RENDEZ-VOUS UTILISATEUR CONNECTÉ (paginated)
// =====================
export const getMyAppointments = async (page: number, limit: number): Promise<BaseResponse<PaginationType<Appointment>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const response = await secureFetch(`${getBaseUrl()}/security/listes/appointments/user${q}`, { method: "GET" });
    return await response.json();
};

// =====================
// RENDEZ-VOUS FOURNISSEUR CONNECTÉ (paginated)
// =====================
export const getProviderAppointments = async (page: number, limit: number): Promise<BaseResponse<PaginationType<Appointment>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const response = await secureFetch(`${getBaseUrl()}/security/listes/appointments/provider${q}`, { method: "GET" });
    return await response.json();
};


// Test de l'api de neo

// =====================
// NEOFACE - DOCUMENT CAPTURE
// =====================
export const neoFaceDocumentCapture = async (  file: File ): Promise<{ document_id: string; url: string; success: boolean;}> => {

    const formData = new FormData();
    formData.append("doc_file", file);
    const response = await secureFetchNeoFace(  "/document_capture",
        {
            method: "POST",
            body: formData,
        }
    );
    return await response.json();
};


// =====================
// NEOFACE - MATCH VERIFY
// =====================

export const neoFaceMatchVerify = async (documentId: string): Promise<{ status: "waiting" | "verified" | "failed"; message: string; document_id: string; matching_score?: number; verified_at?: string; }> => {
    const response = await secureFetchNeoFace( "/match_verify",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ document_id: documentId }),
        }
    );
    return await response.json();
};

