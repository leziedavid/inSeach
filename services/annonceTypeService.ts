import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { AnnonceType } from "@/types/interfaces"; // ton interface front

/* ========================================= CREATE SINGLE TYPE ==================================== */
export const createAnnonceType = async (type: Partial<AnnonceType>): Promise<BaseResponse<AnnonceType>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(type),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création du type d'annonce :", error);
        throw error;
    }
};

/* ========================================= CREATE BATCH TYPES ==================================== */
export const createAnnonceTypeBatch = async (types: Partial<AnnonceType>[]): Promise<BaseResponse<AnnonceType[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type/batch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ types }),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création batch des types d'annonces :", error);
        throw error;
    }
};

/* ========================================= UPDATE TYPE =========================================== */
export const updateAnnonceType = async (id: string, type: Partial<AnnonceType>): Promise<BaseResponse<AnnonceType>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(type),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du type d'annonce :", error);
        throw error;
    }
};

/* ========================================= DELETE TYPE =========================================== */
export const deleteAnnonceType = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du type d'annonce :", error);
        throw error;
    }
};

/* ========================================= GET TYPE BY ID ======================================== */
export const getAnnonceTypeById = async (id: string): Promise<BaseResponse<AnnonceType>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type/${id}`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du type d'annonce :", error);
        throw error;
    }
};

/* ========================================= LIST ALL TYPES ======================================== */
export const listAnnonceTypes = async (): Promise<BaseResponse<AnnonceType[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des types d'annonces :", error);
        throw error;
    }
};

/* ========================================= PAGINATED TYPES ======================================= */
export const paginateAnnonceTypes = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<AnnonceType>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-type/paginate${q}`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération paginée des types d'annonces :", error);
        throw error;
    }
};
