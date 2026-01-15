import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { categoriesAnnonce } from "@/types/interfaces";

/* ============================================ CREATE SINGLE CATEGORY =============================== */
export const createCategory = async (category: any): Promise<BaseResponse<categoriesAnnonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création de la catégorie :", error);
        throw error;
    }
};

/* ============================================ CREATE BATCH CATEGORY =============================== */
export const createCategoryBatch = async ( categories:any[]): Promise<BaseResponse<categoriesAnnonce[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category/batch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categories }),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création batch des catégories :", error);
        throw error;
    }
};

/* ============================================ UPDATE CATEGORY =============================== */
export const updateCategory = async (id: string,category:any): Promise<BaseResponse<categoriesAnnonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie :", error);
        throw error;
    }
};

/* ============================================ DELETE CATEGORY =============================== */
export const deleteCategory = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category/${id}`, {  method: "DELETE",  });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie :", error);
        throw error;
    }
};

/* ============================================ GET CATEGORY BY ID =============================== */
export const getCategoryById = async (id: string): Promise<BaseResponse<categoriesAnnonce>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category/${id}`, {  method: "GET",  });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie :", error);
        throw error;
    }
};

/* ============================================ LIST ALL CATEGORIES =============================== */
export const listCategories = async (): Promise<BaseResponse<categoriesAnnonce[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category`, {  method: "GET",  });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        throw error;
    }
};

/* ============================================ PAGINATED CATEGORIES =============================== */
export const paginateCategories = async ( page?: number,  limit?: number): Promise<BaseResponse<Pagination<categoriesAnnonce>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-category/paginate${q}`, {  method: "GET",  });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération paginée des catégories :", error);
        throw error;
    }
};
