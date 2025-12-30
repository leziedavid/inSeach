'use client';

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    ServiceCategory, ServiceSubcategory, Slider, User, Service, Appointment,
    Order, Transaction, UserStatus, AppointmentStatus, OrderStatus, TransactionStatus
} from "@/types/interfaces";

// ===========================
// Switch de statut générique
// ===========================
type StatusSwitchProps<T> = {  type: "user" | "appointment" | "order" | "transaction";  status: T; };

export const StatusSwitch = <T,>({ type, status }: StatusSwitchProps<T>) => {
    const [checked, setChecked] = useState(() => {
        switch (type) {
            case "user": return status === UserStatus.ACTIVE;
            case "appointment": return status === AppointmentStatus.CONFIRMED;
            case "order": return status === OrderStatus.READY;
            case "transaction": return status === TransactionStatus.COMPLETED;
            default: return false;
        }
    });

    const handleToggle = (value: boolean) => {
        setChecked(value);
        let newStatus: any;

        switch (type) {
            case "user":
                newStatus = value ? UserStatus.ACTIVE : UserStatus.INACTIVE;
                break;
            case "appointment":
                newStatus = value ? AppointmentStatus.CONFIRMED : AppointmentStatus.CANCELLED;
                break;
            case "order":
                newStatus = value ? OrderStatus.READY : OrderStatus.CANCELLED;
                break;
            case "transaction":
                newStatus = value ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
                break;
        }

        console.log(`Changement de statut pour ${type}:`, newStatus);
        // Ici tu peux faire ton appel API pour mettre à jour le status
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch checked={checked} onCheckedChange={handleToggle} id={`${type}-switch`} />
            <Label htmlFor={`${type}-switch`} className="text-xs">
                {checked ? "Actif" : "Inactif"}
            </Label>
        </div>
    );
};
// ===========================
// ServiceCategory Columns
// ===========================
export const ServiceCategoryColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "name", name: "Nom" },
    { key: "description", name: "Description", render: (item: ServiceCategory) => item.description ?? "-" },
    { key: "createdAt", name: "Créé le", render: (item: ServiceCategory) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: ServiceCategory) => new Date(item.updatedAt).toLocaleDateString() },
];

// ===========================
// ServiceSubcategory Columns
// ===========================
export const ServiceSubcategoryColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "name", name: "Nom" },
    { key: "category", name: "Catégorie", render: (item: ServiceSubcategory) => item.categoryId ?? "-" },
    { key: "serviceType", name: "Type de service", render: (item: ServiceSubcategory) => item.serviceType.join(", ") },
    { key: "description", name: "Description", render: (item: ServiceSubcategory) => item.description ?? "-" },
    { key: "createdAt", name: "Créé le", render: (item: ServiceSubcategory) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: ServiceSubcategory) => new Date(item.updatedAt).toLocaleDateString() },
];

// ===========================
// Slider Columns
// ===========================
export const SliderColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "name", name: "Nom" },
    { key: "specialty", name: "Spécialité" },
    { key: "rating", name: "Note" },
    { key: "reviews", name: "Avis" },
    { key: "date", name: "Date" },
    { key: "image", name: "Image", render: (item: Slider) => <Image src={item.image} alt={item.name} width={50} height={50} className="object-cover rounded" unoptimized /> },
    { key: "isToday", name: "Aujourd'hui", render: (item: Slider) => item.isToday ? "Oui" : "Non" },
    { key: "createdAt", name: "Créé le", render: (item: Slider) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: Slider) => new Date(item.updatedAt).toLocaleDateString() },
];

// User Columns
// ===========================
export const UserColumns = (): any[] => [
    {
        key: "images",
        name: "Image",
        render: (item: User) => {
            const src = item.images ?? "/avatars/avatar.jpg";
            return <Image src={src} alt={item.name ?? "Avatar"} width={40} height={40} className="object-cover rounded" unoptimized />;
        },
    },
    { key: "name", name: "Nom" },
    { key: "email", name: "Email" },
    { key: "phone", name: "Téléphone" },
    { key: "roles", name: "Rôle", render: (item: User) => Array.isArray(item.roles) ? item.roles.join(", ") : item.roles },
    {
        key: "status",
        name: "Statut",
        render: (item: User) => <StatusSwitch type="user" status={item.status} />,
    },
    { key: "createdAt", name: "Créé le", render: (item: User) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: User) => new Date(item.updatedAt).toLocaleDateString() },
];

// ===========================
// Service Columns
// ===========================
export const ServiceColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "title", name: "Titre" },
    { key: "provider", name: "Fournisseur", render: (item: Service) => item.provider?.name ?? "-" },
    { key: "serviceType", name: "Type" },
    { key: "basePrice", name: "Prix", render: (item: Service) => item.basePriceCents ? `${item.basePriceCents / 100} €` : "-" },
    { key: "category", name: "Catégorie", render: (item: Service) => item.category?.name ?? "-" },
    { key: "subcategory", name: "Sous-catégorie", render: (item: Service) => item.subcategory?.name ?? "-" },
    { key: "createdAt", name: "Créé le", render: (item: Service) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: Service) => new Date(item.updatedAt).toLocaleDateString() },
];

// ===========================
// Appointment Columns
// ===========================
export const AppointmentColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "service", name: "Service", render: (item: Appointment) => item.service?.title ?? "-" },
    { key: "provider", name: "Fournisseur", render: (item: Appointment) => item.providerId ?? "-" },
    { key: "client", name: "Client", render: (item: Appointment) => item.client?.name ?? "-" },
    { key: "status", name: "Statut", render: (item: Appointment) => <StatusSwitch type="appointment" status={item.status} /> },
    { key: "scheduledAt", name: "Planifié le", render: (item: Appointment) => item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : "-" },
    { key: "price", name: "Prix", render: (item: Appointment) => item.priceCents ? `${item.priceCents / 100} €` : "-" },
    { key: "createdAt", name: "Créé le", render: (item: Appointment) => new Date(item.createdAt).toLocaleDateString() },
];


// ===========================
// Order Columns
// ===========================
export const OrderColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "client", name: "Client", render: (item: Order) => item.clientId ?? "-" },
    { key: "provider", name: "Fournisseur", render: (item: Order) => item.providerId ?? "-" },
    { key: "status", name: "Statut", render: (item: Order) => <StatusSwitch type="order" status={item.status} /> },
    { key: "total", name: "Total", render: (item: Order) => `${item.totalCents / 100} €` },
    { key: "createdAt", name: "Créé le", render: (item: Order) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: Order) => new Date(item.updatedAt).toLocaleDateString() },
];

// ===========================
// Transaction Columns
// ===========================
export const TransactionColumns = (): any[] => [
    { key: "id", name: "ID" },
    { key: "user", name: "Utilisateur", render: (item: Transaction) => item.userId ?? "-" },
    { key: "amount", name: "Montant", render: (item: Transaction) => `${item.amountCents / 100} ${item.currency}` },
    { key: "status", name: "Statut", render: (item: Transaction) => <StatusSwitch type="transaction" status={item.status} /> },
    { key: "description", name: "Description", render: (item: Transaction) => item.description ?? "-" },
    { key: "createdAt", name: "Créé le", render: (item: Transaction) => new Date(item.createdAt).toLocaleDateString() },
    { key: "updatedAt", name: "Mis à jour", render: (item: Transaction) => new Date(item.updatedAt).toLocaleDateString() },
];
