import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { Annonce } from "@/types/interfaces";
import { get } from "lodash";

/* ============================================ CREATE Annonce // =============================== */

export const createAnnonce = async (formData: FormData): Promise<BaseResponse<Annonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce`, {
            method: "POST",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création de l'annonce :", error);
        throw error;
    }
};

/* ============================================ UPDATE Annonce // =============================== */

export const updateAnnonce = async (id: string, formData: FormData): Promise<BaseResponse<Annonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce/${id}`, {
            method: "PATCH",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'annonce :", error);
        throw error;
    }
};

/* ============================================ GET Annonce By ID // =============================== */

export const getAnnonceById = async (id: string): Promise<BaseResponse<Annonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
        throw error;
    }
};

/* ============================================ DELETE Annonce // =============================== */

export const deleteAnnonce = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'annonce :", error);
        throw error;
    }
};


// liest annonce
export const getAllannonces = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Annonce>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await fetch(`${getBaseUrl()}/annonce${q}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" } });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des annonces :", error);
        throw error;
    }
};

// filtre annonce
export const filterAnnonces = async (params: any): Promise<BaseResponse<Pagination<Annonce>>> => {
    try {
        const res = await fetch(  `${getBaseUrl()}/annonce/filter-annonces`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors du filtrage des annonces :", error);
        throw error;
    }
};

// getannoncesByUserId
// liest annonce
export const getMyAllAnnonces = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Annonce>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce/me/annonce/user/paginate${q}`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des annonces :", error);
        throw error;
    }
};


