import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { Service } from "@/types/interfaces";


/* ============================================
📌 CREATE SERVICE
============================================ */
export const createService = async (formData: FormData): Promise<BaseResponse<Service>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/service`, {
            method: "POST",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création du service :", error);
        throw error;
    }
};

/* ============================================
📌 UPDATE SERVICE
============================================ */
export const updateService = async (id: string, formData: FormData): Promise<BaseResponse<Service>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/service/${id}`, {
            method: "PATCH",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        throw error;
    }
};

/* ============================================
📌 GET SERVICE BY ID
============================================ */
export const getServiceById = async (id: string): Promise<BaseResponse<Service>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/service/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du service :", error);
        throw error;
    }
};

/* ============================================
📌 DELETE SERVICE
============================================ */
export const deleteService = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/service/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du service :", error);
        throw error;
    }
};

/* ============================================
📌 LISTE PAGINÉE DES SERVICES
(page & limit facultatifs)
============================================ */

export const listServices = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Service>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await fetch(`${getBaseUrl()}/service${q}`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        throw error;
    }
};


/* ============================================
📌 GET SERVICES D'UN UTILISATEUR
============================================ */

export const getByUserId = async (page: number, limit: number): Promise<BaseResponse<Pagination<Service>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/service/all/servicesbyUserId/${q}`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
        throw error;
    }
};

/* ============================================
📌 FILTER SERVICES AVEC PAGINATION
============================================ */
export const filterServices = async (params: any): Promise<BaseResponse<Pagination<Service>>> => {
    try {
        const res = await fetch(`${getBaseUrl()}/service/filter-services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors du filtrage des services :", error);
        throw error;
    }
};
