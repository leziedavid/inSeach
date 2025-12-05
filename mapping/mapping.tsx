// mapping.tsx

import {Role,AccountType,ServiceType,TransactionStatus,AppointmentStatus,OrderStatus,} from "@/types/interfaces";

// ===========================
// MAPPINGS EN FRANÇAIS
// ===========================
export const roleLabels: Record<Role, string> = {
    [Role.ADMIN]: "Administrateur",
    [Role.PROVIDER]: "Prestataire",
    [Role.CLIENT]: "Client",
    [Role.SELLER]: "Vendeur",
    [Role.USER]: "Utilisateur",
};

export const accountTypeLabels: Record<AccountType, string> = {
    [AccountType.SELLER]: "Entreprise",
    [AccountType.INDIVIDUAL]: "Utilisateur",
    [AccountType.ENTERPRISE]: "Organisation",
};

export const serviceTypeLabels: Record<ServiceType, string> = {
    [ServiceType.APPOINTMENT]: "Prestation de service",
    [ServiceType.ORDER]: "Logistique/Livraison/Location",
    [ServiceType.PRODUCT]: "e-Commerce",
    [ServiceType.MIXED]: "Mixte",
};

export const transactionStatusLabels: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: "En attente",
    [TransactionStatus.COMPLETED]: "Terminée",
    [TransactionStatus.FAILED]: "Échouée",
    [TransactionStatus.REFUNDED]: "Remboursée",
};

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: "Demandé",
    [AppointmentStatus.CONFIRMED]: "Confirmé",
    [AppointmentStatus.REJECTED]: "Rejeté",
    [AppointmentStatus.COMPLETED]: "Terminé",
    [AppointmentStatus.CANCELLED]: "Annulé",
    [AppointmentStatus.REQUESTED]: "Demandé",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.NEW]: "Nouvelle commande",
    [OrderStatus.PROCESSING]: "En traitement",
    [OrderStatus.READY]: "Prête",
    [OrderStatus.DELIVERED]: "Livrée",
    [OrderStatus.CANCELLED]: "Annulée",
    [OrderStatus.REFUNDED]: "Remboursée",
};

// ===========================
// FONCTION GÉNÉRIQUE DE TRADUCTION
// ===========================
export function translateEnum<T>(
    value: T,
    mapping: Record<string, string>
): string {
    return mapping[value as keyof typeof mapping] || String(value);
}
