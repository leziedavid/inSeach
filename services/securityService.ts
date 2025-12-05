// services/securityService.ts
import { useAuthMiddleware } from "@/app/middleware";
import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Appointment, Order, User } from "@/types/interfaces";
import { Pagination as PaginationType } from "@/types/pagination";
import { Register } from "@/types/Request";
import { GeoLocationResult } from "@/utils/geolocation";

// secureFetch: utilisé uniquement pour routes protégées
export const secureFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    await useAuthMiddleware();
    const token = localStorage.getItem("access_token") || "";
    const headers = {  ...(options.headers || {}), Authorization: `Bearer ${token}`,  };
    return fetch(url, { ...options, headers });
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
