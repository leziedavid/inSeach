import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { OverviewStats } from "@/types/interfaces";

/* ============================================
📊 GET OVERVIEW STATS
============================================ */
export const getOverviewStats = async (type?: "ORDERS" | "APPOINTMENTS"): Promise<BaseResponse<OverviewStats>> => {
    const q = type ? `?type=${type}` : '';
    try {
        const res = await secureFetch(`${getBaseUrl()}/history/overview${q}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        throw error;
    }
};

/* ============================================
🔁 GET USER HISTORY (PAGINATED)
============================================ */
export const getUserHistory = async (page?: number, limit?: number, type?: "ORDERS" | "APPOINTMENTS", status?: string): Promise<BaseResponse<Pagination<any>>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (type) params.append('type', type);
    if (status) params.append('status', status);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    try {
        const res = await secureFetch(`${getBaseUrl()}/history/me${queryString}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de l’historique :", error);
        throw error;
    }
};

/* ============================================
🔁 GET ALL HISTORY (ADMIN / PAGINATED)
============================================ */
export const getAllHistory = async (
    page?: number,
    limit?: number,
    type?: "ORDERS" | "APPOINTMENTS",
    status?: string,
    providerId?: string
): Promise<BaseResponse<Pagination<any>>> => {
    const params: any = { page, limit };
    if (type) params.type = type;
    if (status) params.status = status;
    if (providerId) params.providerId = providerId;

    try {
        const res = await secureFetch(`${getBaseUrl()}/history/admin?${new URLSearchParams(params).toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de l’historique admin :", error);
        throw error;
    }
};
