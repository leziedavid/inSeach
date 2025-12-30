'use client'

import { refreshTokens } from '@/services/securityService'
import { AccountType, ServiceType, User, UserLocation } from '@/types/interfaces'
// Import de la fonction qui appelle l'API backend pour rafraîchir le token
import { jwtDecode, JwtPayload } from 'jwt-decode'
import { toast } from 'sonner'

export enum Role {
    ADMIN = "ADMIN",
    PROVIDER = "PROVIDER",
    CLIENT = "CLIENT",
    USER = "USER",
    SELLER = "SELLER",
}
// Enumération des rôles utilisateurs possibles dans l'application

export enum UserStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
}
// Enumération des statuts d'utilisateur possibles

interface DecodedToken extends JwtPayload {
    sub: string             // Identifiant unique de l'utilisateur (subject)
    roles: Role              // Rôle de l'utilisateur (ex: ADMIN, USER)
    status: UserStatus      // Statut de l'utilisateur (ex: ACTIVE, BLOCKED)
    name: string | null // Nom de l'utilisateur (peut être null)
    companyName: string | null // Nom de l'utilisateur (peut être null)
    typeCompte: AccountType
    location: UserLocation
    serviceType: ServiceType
    imageUrl: string | null // URL de l'image de profil (peut être null)
    partnerId: string | null // ID du partenaire (peut être null)
    wallet: number | null // Balance du portefeuille (peut être null)
    compte: string | null // Numéro de compte (peut être null)
}

export const getTokenFromLocalStorage = (): string | null => {
    // Fonction pour récupérer le token d'accès depuis le localStorage (si on est en navigateur)
    if (typeof window !== 'undefined') {
        return localStorage.getItem('access_token') // Retourne le token ou null si absent
    }
    return null // Si on n'est pas en navigateur, retourne null
}

const isTokenValid = (token: string): boolean => {
    // Vérifie si le token JWT est encore valide (pas expiré)
    try {
        const decoded = jwtDecode<DecodedToken>(token) // Décode le token pour lire sa payload
        const currentTime = Math.floor(Date.now() / 1000) // Temps actuel en secondes UNIX
        return decoded.exp !== undefined && decoded.exp > currentTime // true si non expiré
    } catch {
        return false // En cas d'erreur de décodage, token invalide
    }
}

let refreshTokenPromise: Promise<string | null> | null = null;

const tryRefreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    // 🔄 Une autre tentative est en cours ? => on attend
    if (refreshTokenPromise) return refreshTokenPromise;

    // 🔐 Lancer le refresh (et que 1 fois)
    refreshTokenPromise = (async () => {
        try {
            const response = await refreshTokens(refreshToken);
            if (response.statusCode === 200 && response.data?.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                return response.data.access_token;
            } else {
                return null;
            }
        } catch (error) {
            toast.error('Erreur lors du rafraîchissement de la session. Veuillez vous reconnecter.');
            console.error('Erreur lors du refresh token :', error);
            return null;
        } finally {
            // 🔓 Libérer la promesse une fois terminée
            refreshTokenPromise = null;
        }
    })();

    return refreshTokenPromise;
};


export const useAuthMiddlewareOne = async (): Promise<DecodedToken | null> => {
    // Fonction principale qui contrôle l’authentification et rafraîchit le token si besoin
    let token = getTokenFromLocalStorage() // Récupère le token actuel

    if (!token || !isTokenValid(token)) {
        // Si pas de token ou token invalide
        const newToken = await tryRefreshAccessToken() // Tente de rafraîchir
        if (!newToken || !isTokenValid(newToken)) {
            // Si échec rafraîchissement ou token toujours invalide
            localStorage.removeItem('access_token') // Supprime tokens
            localStorage.removeItem('refresh_token')
            return null
        }
        token = newToken // Sinon, utilise le nouveau token
    }
    return jwtDecode<DecodedToken>(token) // Decode et retourne les infos utilisateur
}

export const getUserId = async (): Promise<string | null> => {
    // Récupère l'ID utilisateur depuis le token décodé
    const user = await useAuthMiddleware()
    return user?.sub ?? null
}

// getwallet

export const getUserWallet = async (): Promise<number | null> => {
    // Récupère le rôle utilisateur depuis le token décodé
    const user = await useAuthMiddleware()
    return user?.wallet ?? null
}

// compte
export const getUserAccountNumber = async (): Promise<string | null> => {
    // Récupère le rôle utilisateur depuis le token décodé
    const user = await useAuthMiddleware()
    return user?.compte ?? null
}

export const getUserRole = async (): Promise<Role | null> => {
    // Récupère le rôle utilisateur depuis le token décodé
    const user = await useAuthMiddlewareOne()
    return user?.roles ?? null
}

export const getUserStatus = async (): Promise<UserStatus | null> => {
    // Récupère le statut utilisateur depuis le token décodé
    const user = await useAuthMiddleware()
    return user?.status ?? null
}

export const getUserImageUrl = async (): Promise<string | null> => {
    // Récupère l'URL de l'image utilisateur depuis le token décodé
    const user = await useAuthMiddlewareOne()
    return user?.imageUrl ?? null
}

export const getUserName = async (): Promise<string | null> => {
    // Récupère le nom de l'utilisateur depuis le token décodé
    const user = await useAuthMiddlewareOne()
    return user?.name ?? user?.companyName ?? null
}

export const getUserInfos = async (): Promise<{
    id: string
    roles: Role
    typeCompte: AccountType
    serviceType: ServiceType
    location: UserLocation
    name?: string
    companyName?: string
    status: UserStatus
} | null> => {

    const user = await useAuthMiddleware()
    if (!user) return null

    return {
        id: user.sub,
        roles: user.roles,
        typeCompte: user.typeCompte,
        serviceType: user.serviceType,
        location: user.location,
        name: user.name ?? undefined,
        companyName: user.companyName ?? undefined,
        status: user.status,
    }
}


export const isUserAuthenticated = async (): Promise<boolean> => {
    let token = getTokenFromLocalStorage()
    if (!token || !isTokenValid(token)) {
        const newToken = await tryRefreshAccessToken()
        if (!newToken || !isTokenValid(newToken)) {
            // Échec du refresh, l'utilisateur n'est pas authentifié
            return false
        }
        token = newToken
    }
    return true
}

let isLoggingOut = false

export const logout = (): void => {
    if (isLoggingOut) return; // Si déjà en cours, on quitte
    isLoggingOut = true; // On active le verrou
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        refreshTokenPromise = null; // 🔓 on reset la promesse
        window.location.href = '/'; // Redirige vers login
    }
}

/**
 * Vérifie si l'utilisateur est encore authentifié via access_token ou refresh_token.
 * @returns boolean : true si un token valide est présent ou récupéré, false sinon.
 */

export const getRefreshTokenFromLocalStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('refresh_token') || null
    }
    return null
}

export const isSessionStillValid = async (): Promise<boolean> => {
    const accessToken = getTokenFromLocalStorage()
    if (accessToken && isTokenValid(accessToken)) return true

    const refreshToken = getRefreshTokenFromLocalStorage()
    if (!refreshToken) return false

    try {
        const decoded = jwtDecode<JwtPayload>(refreshToken)
        const now = Math.floor(Date.now() / 1000)
        if (!decoded.exp || decoded.exp <= now) return false
    } catch {
        return false
    }

    const newAccessToken = await tryRefreshAccessToken()
    return !!newAccessToken && isTokenValid(newAccessToken)
}

export const useAuthMiddleware = async (): Promise<DecodedToken | null> => {
    const token = getTokenFromLocalStorage()
    if (token && isTokenValid(token)) return jwtDecode<DecodedToken>(token)

    const newToken = await tryRefreshAccessToken()
    if (!newToken || !isTokenValid(newToken)) {
        logout() // ici on redirige car c’est une page privée
        return null
    }

    return jwtDecode<DecodedToken>(newToken)
}

