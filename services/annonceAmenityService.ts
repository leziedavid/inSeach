// services/annonceAmenityService.ts

import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { secureFetch } from "@/services/securityService";
import {Amenity } from "@/types/interfaces";
import { Pagination } from "@/types/pagination";

/* ============================================
 * CREATE AMENITY
 * ============================================ */
export const createAmenity = async (formData: FormData): Promise<BaseResponse<Amenity>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity`, {
            method: "POST",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création de l'amenity :", error);
        throw error;
    }
};

/* ============================================
 * UPDATE AMENITY
 * ============================================ */
export const updateAmenity = async (id: string, formData: FormData): Promise<BaseResponse<Amenity>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity/${id}`, {
            method: "PATCH",
            body: formData,
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'amenity :", error);
        throw error;
    }
};

/* ============================================
 * DELETE AMENITY
 * ============================================ */
export const deleteAmenity = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression de l'amenity :", error);
        throw error;
    }
};

/* ============================================
 * GET ALL AMENITIES
 * ============================================ */
export const getAllAmenities = async (): Promise<BaseResponse<Amenity[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des amenities :", error);
        throw error;
    }
};

/* ============================================
 * GET AMENITIES BY ANNOUNCE
 * ============================================ */
export const getAmenitiesByAnnonce = async (annonceId: string): Promise<BaseResponse<Amenity[]>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity/by-annonce/${annonceId}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des amenities pour l'annonce :", error);
        throw error;
    }
};

/* ============================================
 * PAGINATE AMENITIES (ADMIN)
 * ============================================ */
export const paginateAmenities = async (
    page?: number,
    limit?: number
): Promise<BaseResponse<Pagination<Amenity>>> => {
    const query = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/annonce-amenity/paginate${query}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération paginée des amenities :", error);
        throw error;
    }
};
