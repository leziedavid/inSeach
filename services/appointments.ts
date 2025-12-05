import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import { Appointment, AppointmentStatus, CalendarResponse } from "@/types/interfaces";

/* ============================================
📌 CREATE APPOINTMENT
============================================ */
export const createAppointment = async (data: any): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création du rendez-vous :", error);
        throw error;
    }
};

/* ============================================
📌 UPDATE APPOINTMENT
============================================ */
export const updateAppointment = async (id: string, data: any): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointments/${id}`, {
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous :", error);
        throw error;
    }
};


/** --------------------- 🔁 Mettre à jour un statut --------------------- */
export const updateStatut = async (id: string, data: AppointmentStatus, priceCents?: number): Promise<BaseResponse<Appointment>> => {
    try {
        const bodyObj = { status: data, ...(priceCents !== undefined && { priceCents }) };
        const body = JSON.stringify(bodyObj);
        const res = await secureFetch(`${getBaseUrl()}/appointments/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body
        });
        return await res.json();

    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut du rendez-vous :", error);
        throw error;
    }
};


/** --------------------- ⭐ Ajouter un rating à un rendez-vous --------------------- */

export const addRatingOfAppointment = async (id: string, rating: number, comment: string): Promise<BaseResponse<Appointment>> => {
    try {
        const bodyObj = { rating, comment };
        const body = JSON.stringify(bodyObj);
        const res = await secureFetch(`${getBaseUrl()}/appointments/${id}/rating`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body
        });
        return await res.json();

    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut du rendez-vous :", error);
        throw error;
    }
};

/* ============================================
📌 GET APPOINTMENT BY ID
============================================ */
export const getAppointmentById = async (id: string): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointments/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du rendez-vous :", error);
        throw error;
    }
};

/* ============================================
📌 DELETE APPOINTMENT
============================================ */
export const deleteAppointment = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointments/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous :", error);
        throw error;
    }
};

/* ============================================
📌 LISTE PAGINÉE DES APPOINTMENTS
============================================ */
export const listAppointments = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Appointment>>> => {
    const q = `?page=${page ?? 1}&limit=${limit ?? 4}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointments/listes/user${q}`, { method: "GET", });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous :", error);
        throw error;
    }
};

/* ============================================
📌 FILTER APPOINTMENTS AVEC PAGINATION
============================================ */
export const filterAppointments = async (params: any): Promise<BaseResponse<Pagination<Appointment>>> => {
    try {
        const res = await secureFetch(
            `${getBaseUrl()}/appointments/filter-appointments`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(params),
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors du filtrage des rendez-vous :", error);
        throw error;
    }
};


// all/calendar
export const getCalendarData = async (year?: number, month?: number): Promise<BaseResponse<CalendarResponse>> => {
    // Construire les query params
    const params = new URLSearchParams();
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const res = await secureFetch(`${getBaseUrl()}/appointments/all/calendar${queryString}`,
        { method: "GET", headers: { 'Content-Type': 'application/json', } }
    );

    return await res.json();
};
