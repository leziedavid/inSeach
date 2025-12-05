// services/categoryService.ts

import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination as PaginationType } from "@/types/pagination";

// ===============================
// 📌 IMPORT EXCEL / CSV
// ===============================
export const uploadCategoryFile = async (formData: FormData): Promise<any> => {
    try {
        const response = await fetch(`${getBaseUrl()}/categories/import-file`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
            },
        });
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l’import de catégories:', error);
        throw error;
    }
};

// ===============================
// 📌 CATEGORY CRUD
// ===============================
export const createCategory = async (dto: any): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(dto),
    });
    return await response.json();
};

export const updateCategory = async (id: string, dto: any): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(dto),
    });
    return await response.json();
};

export const deleteCategory = async (id: string): Promise<void> => {
    await fetch(`${getBaseUrl()}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
};

export const listCategories = async (): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};

// ===============================
// 📌 SUBCATEGORY CRUD
// ===============================
export const createSubcategory = async (dto: any): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/sub`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(dto),
    });
    return await response.json();
};

export const updateSubcategory = async (id: string, dto: any): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/sub/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify(dto),
    });
    return await response.json();
};

export const deleteSubcategory = async (id: string): Promise<void> => {
    await fetch(`${getBaseUrl()}/categories/sub/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
};

export const listSubcategories = async (): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/sub`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};

// ===============================
// 📌 FRONT-END QUERIES
// ===============================
export const getAllCategoriesWithSubcategories = async (): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/with/subcategories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};

export const getSubcategoriesByCategory = async (categoryId: string): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/${categoryId}/subcategories`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};

export const getAllSubcategoriesWithCategory = async (): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/sub/all/with-category`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};

// Retourner toutes les sous-catégories avec leur catégori

export const searchSubcategoriesByName = async (name: string): Promise<BaseResponse<any>> => {
    const response = await fetch(`${getBaseUrl()}/categories/sub/search/name?name=${name}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
    });
    return await response.json();
};
