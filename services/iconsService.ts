// services/iconsService.ts

import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination as PaginationType } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { Icone } from "@/types/interfaces";

/* ============================================
📌 CREATE ICON (UPLOAD)
============================================ */
export const createIcon = async (formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/icone`, {
            method: "POST",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création d'une icône :", error);
        throw error;
    }
};

/* ============================================
📌 UPDATE ICON
============================================ */
export const updateIcon = async ( id: string, formData: FormData): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/icone/${id}`, {
            method: "PATCH",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'icône :", error);
        throw error;
    }
};

/* ============================================
📌 LISTE PAGINÉE DES ICONES
signature standard → (page: number, limit: number)
============================================ */
export const listIcons = async ( page: number,limit: number): Promise<BaseResponse<PaginationType<Icone>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    const res = await secureFetch(`${getBaseUrl()}/icone${q}`, {
        method: "GET",
    });

    return await res.json();
};

/* ============================================
📌 GET ICON BY ID
============================================ */
export const getIconById = async (id: string): Promise<BaseResponse<any>> => {
    const res = await secureFetch(`${getBaseUrl()}/icone/${id}`, {
        method: "GET",
    });

    return await res.json();
};

/* ============================================
📌 DELETE ICON
============================================ */
export const deleteIcon = async (id: string): Promise<BaseResponse<any>> => {
    const res = await secureFetch(`${getBaseUrl()}/icone/${id}`, {
        method: "DELETE",
    });

    return await res.json();
};
