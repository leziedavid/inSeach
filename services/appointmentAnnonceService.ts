import { BaseResponse } from "@/types/BaseResponse";
import { getBaseUrl } from "@/types/baseUrl";
import { Pagination } from "@/types/pagination";
import { secureFetch } from "@/services/securityService";
import {Appointment, AppointmentStatus, CalendarResponse,Annonce} from "@/types/interfaces";

// Types spécifiques pour les rendez-vous annonces
export interface AppointmentAnnonce extends Appointment {
    annonceId?: string;
    entryDate?: string;
    departureDate?: string;
    nights?: number;
    annonce?: Annonce;
}

export interface CheckAvailabilityResponse {
    isAvailable: boolean;
    conflictingAppointments: number;
    nights: number;
    entryDate: string;
    departureDate: string;
}

export interface AvailabilityCheckRequest {
    annonceId: string;
    entryDate: string;
    departureDate: string;
    appointmentId?: string;
}

export interface RatingRequest {
    rating: number;
    comment?: string;
}

export interface CalendarQueryParams {
    year?: number;
    month?: number;
    annonceId?: string;
}

/* ============================================
📌 CREATE APPOINTMENT ANNONCE
============================================ */
export const createAppointmentAnnonce = async (data: any): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la création du rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 UPDATE APPOINTMENT ANNONCE
============================================ */
export const updateAppointmentAnnonce = async (id: string, data: any): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/${id}`, {
            headers: { "Content-Type": "application/json" },
            method: "PATCH",
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 UPDATE APPOINTMENT ANNONCE STATUS
============================================ */
export const updateAppointmentAnnonceStatus = async (id: string, status: AppointmentStatus, priceCents?: number): Promise<BaseResponse<Appointment>> => {
    try {
        const bodyObj = { status, ...(priceCents !== undefined && { priceCents }) };
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyObj)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut du rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 ADD RATING TO APPOINTMENT ANNONCE
============================================ */
export const addRatingToAppointmentAnnonce = async (id: string, rating: number, comment?: string): Promise<BaseResponse<Appointment>> => {
    try {
        const bodyObj: RatingRequest = {
            rating,
            ...(comment && { comment })
        };
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/${id}/rating`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyObj)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de l'ajout du rating au rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 GET APPOINTMENT ANNONCE BY ID
============================================ */
export const getAppointmentAnnonceById = async (id: string): Promise<BaseResponse<Appointment>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/${id}`, {
            method: "GET",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération du rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 DELETE APPOINTMENT ANNONCE
============================================ */
export const deleteAppointmentAnnonce = async (id: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/${id}`, {
            method: "DELETE",
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la suppression du rendez-vous annonce :", error);
        throw error;
    }
};

/* ============================================
📌 LIST PAGINATED APPOINTMENT ANNONCES
============================================ */
export const listAppointmentAnnonces = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Appointment>>> => {
    const query = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces${query}`, {
            method: "GET"
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous annonces :", error);
        throw error;
    }
};

/* ============================================
📌 LIST USER APPOINTMENT ANNONCES
============================================ */
export const listUserAppointmentAnnonces = async (page?: number, limit?: number): Promise<BaseResponse<Pagination<Appointment>>> => {
    const query = `?page=${page ?? 1}&limit=${limit ?? 10}`;
    try {
        const res = await secureFetch(
            `${getBaseUrl()}/appointment-annonces/listes/user${query}`,
            { method: "GET" }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous annonces utilisateur :", error);
        throw error;
    }
};

/* ============================================
📌 GET CALENDAR DATA FOR APPOINTMENT ANNONCES
============================================ */
export const getCalendarDataForAnnonces = async (year?: number, month?: number): Promise<BaseResponse<CalendarResponse>> => {
    const params = new URLSearchParams();
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
        const res = await secureFetch(
            `${getBaseUrl()}/appointment-annonces/all/calendar${queryString}`,
            {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données calendrier annonces :", error);
        throw error;
    }
};

/* ============================================
📌 GET CALENDAR DATA FOR SPECIFIC ANNONCE
============================================ */
export const getCalendarDataForAnnonce = async (annonceId: string, year?: number, month?: number): Promise<BaseResponse<CalendarResponse>> => {

    const params = new URLSearchParams();
    if (year !== undefined) params.append('year', year.toString());
    if (month !== undefined) params.append('month', month.toString());
    const queryString = params.toString() ? `?${params.toString()}` : '';

    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/annonce/${annonceId}/calendar${queryString}`,
            {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des données calendrier pour l'annonce :", error);
        throw error;
    }
};

/* ============================================
📌 CHECK AVAILABILITY
============================================ */
export const checkAvailability = async (data: AvailabilityCheckRequest): Promise<BaseResponse<CheckAvailabilityResponse>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/check-availability`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la vérification de disponibilité :", error);
        throw error;
    }
};

/* ============================================
📌 FILTER APPOINTMENT ANNONCES
============================================ */
export const filterAppointmentAnnonces = async (
    filters: {
        annonceId?: string;
        clientId?: string;
        providerId?: string;
        status?: AppointmentStatus;
        startDate?: string;
        endDate?: string;
        interventionType?: string;
    },
    page?: number,
    limit?: number): Promise<BaseResponse<Pagination<AppointmentAnnonce>>> => {
    const query = new URLSearchParams();
    if (page) query.append('page', page.toString());
    if (limit) query.append('limit', limit.toString());

    if (filters.annonceId) query.append('annonceId', filters.annonceId);
    if (filters.clientId) query.append('clientId', filters.clientId);
    if (filters.providerId) query.append('providerId', filters.providerId);
    if (filters.status) query.append('status', filters.status);
    if (filters.startDate) query.append('startDate', filters.startDate);
    if (filters.endDate) query.append('endDate', filters.endDate);
    if (filters.interventionType) query.append('interventionType', filters.interventionType);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
        const res = await secureFetch(
            `${getBaseUrl()}/appointment-annonces/filter${queryString}`,
            { method: "GET" }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors du filtrage des rendez-vous annonces :", error);
        throw error;
    }
};

/* ============================================
📌 GET USER STATS FOR APPOINTMENT ANNONCES
============================================ */
export const getUserAppointmentAnnonceStats = async (): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/stats/user`,
            { method: "GET" }
        );
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        throw error;
    }
};

/* ============================================
📌 GET ANNONCE STATS
============================================ */
export const getAnnonceAppointmentStats = async (annonceId: string): Promise<BaseResponse<any>> => {
    try {
        const res = await secureFetch(`${getBaseUrl()}/appointment-annonces/annonce/${annonceId}/stats`, { method: "GET" });
        return await res.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques de l'annonce :", error);
        throw error;
    }
};

/* ============================================
📌 VALIDATE DATES FOR APPOINTMENT ANNONCE
============================================ */
export const validateAppointmentAnnonceDates = (entryDate: string, departureDate: string): { isValid: boolean; error?: string; nights?: number } => {
    try {
        const entry = new Date(entryDate);
        const departure = new Date(departureDate);

        if (departure <= entry) {
            return {
                isValid: false,
                error: "La date de départ doit être après la date d'arrivée"
            };
        }

        // Calculer le nombre de nuits
        const diffTime = Math.abs(departure.getTime() - entry.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (nights < 1) {
            return {
                isValid: false,
                error: "La réservation doit être d'au moins une nuit"
            };
        }

        return { isValid: true, nights };
    } catch (error) {
        return {
            isValid: false,
            error: "Format de date invalide"
        };
    }
};

/* ============================================
📌 CALCULATE PRICE FOR APPOINTMENT ANNONCE
============================================ */
export const calculateAppointmentAnnoncePrice = (pricePerNight: number, nights: number): number => {
    return pricePerNight * nights;
};

/* ============================================
📌 FORMAT APPOINTMENT ANNONCE FOR DISPLAY
============================================ */
export const formatAppointmentAnnonceForDisplay = (appointment: AppointmentAnnonce): any => {
    return {
        ...appointment,
        formattedEntryDate: appointment.entryDate
            ? new Date(appointment.entryDate).toLocaleDateString('fr-FR')
            : 'Non spécifiée',
        formattedDepartureDate: appointment.departureDate
            ? new Date(appointment.departureDate).toLocaleDateString('fr-FR')
            : 'Non spécifiée',
        formattedPrice: appointment.priceCents
            ? `${(appointment.priceCents / 100).toFixed(2)} €`
            : 'Non spécifié',
        totalPrice: appointment.nights && appointment.priceCents
            ? `${(appointment.nights * appointment.priceCents / 100).toFixed(2)} €`
            : 'Non calculable',
        durationText: appointment.nights
            ? `${appointment.nights} nuit${appointment.nights > 1 ? 's' : ''}`
            : 'Durée non spécifiée'
    };
};

/* ============================================
📌 GET APPOINTMENT ANNONCE STATUS LABEL
============================================ */
export const getAppointmentAnnonceStatusLabel = (status: AppointmentStatus): { label: string; color: string } => {
    const statusLabels: Record<AppointmentStatus, { label: string; color: string }> = {
        [AppointmentStatus.REQUESTED]: { label: "Demandé", color: "warning" },
        [AppointmentStatus.PENDING]: { label: "Demandé", color: "warning" },
        [AppointmentStatus.CONFIRMED]: { label: "Confirmé", color: "success" },
        [AppointmentStatus.COMPLETED]: { label: "Terminé", color: "primary" },
        [AppointmentStatus.CANCELLED]: { label: "Annulé", color: "danger" },
        [AppointmentStatus.REJECTED]: { label: "Rejeté", color: "danger" }

    };

    return statusLabels[status] || { label: "Inconnu", color: "secondary" };
};

/* ============================================
📌 CANCEL APPOINTMENT ANNONCE (WRAPPER)
============================================ */
export const cancelAppointmentAnnonce = async (id: string): Promise<BaseResponse<AppointmentAnnonce>> => {
    return updateAppointmentAnnonceStatus(id, AppointmentStatus.CANCELLED);
};

/* ============================================
📌 CONFIRM APPOINTMENT ANNONCE (WRAPPER)
============================================ */
export const confirmAppointmentAnnonce = async (id: string, priceCents?: number): Promise<BaseResponse<AppointmentAnnonce>> => {
    return updateAppointmentAnnonceStatus(id, AppointmentStatus.CONFIRMED, priceCents);
};

/* ============================================
📌 COMPLETE APPOINTMENT ANNONCE (WRAPPER)
============================================ */
export const completeAppointmentAnnonce = async (id: string, priceCents?: number): Promise<BaseResponse<AppointmentAnnonce>> => {
    return updateAppointmentAnnonceStatus(id, AppointmentStatus.COMPLETED, priceCents);
};