// interfaces.ts

import { StaticImageData } from "next/image";

// ===========================
// ENUMS
// ===========================
export enum Role {
    ADMIN = "ADMIN",
    PROVIDER = "PROVIDER",
    CLIENT = "CLIENT",
    USER = "USER",
    SELLER = "SELLER",
}

export enum AccountType {
    SELLER = "SELLER",
    INDIVIDUAL = "INDIVIDUAL",
    ENTERPRISE = "ENTERPRISE",
}

export enum ServiceType {
    APPOINTMENT = "APPOINTMENT",
    ORDER = "ORDER",
    PRODUCT = "PRODUCT",
    MIXED = "MIXED",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

export enum AppointmentStatus {
    PENDING = "PENDING",
    REQUESTED = "REQUESTED",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface UserLocation {
    lat: number | null;
    lng: number | null;
    country?: string | null;
    city?: string | null;
    district?: string | null;
    street?: string | null;
}


export enum OrderStatus {
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    READY = "READY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

export enum UserStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

// ===========================
// MODELS (Simplifiés pour le front-end)
// ===========================

export interface ServiceCategory {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceSubcategory {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    serviceType: ServiceType[];
    createdAt: string;
    updatedAt: string;
}

export interface UserCategory {
    id: string;
    userId: string;
    categoryId: string;
    category: ServiceCategory;
    createdAt: string;
}

export interface UserSubcategory {
    id: string;
    userId: string;
    subcategoryId: string;
    subcategory: ServiceSubcategory;
    createdAt: string;
}

export interface FileManager {
    id: number;
    fileCode: string;
    fileName: string;
    fileMimeType: string;
    fileSize: number;
    fileUrl: string;
    fileType: string;
    targetId: string;
    filePath?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Icone {
    id: string;
    name: string;
    description?: string;
    iconUrl: string;
    createdAt: string;
    updatedAt: string;
}
export interface Wallet {
    id: string;
    userId: string;
    balanceCents: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

// types/Slider.ts
export interface Slider {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: number;
    date: string;
    image: string;
    isToday?: boolean;
    createdAt: string;
    updatedAt: string;
    isVisible?: boolean; // Ajouté pour le CRUD
}


export interface AuthUser {
    id: string
    roles: Role
    typeCompte: AccountType
    serviceType: ServiceType
    location?: UserLocation
    name?: string
    companyName?: string
    status: UserStatus
}


export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    typeCompte: AccountType;
    serviceType: ServiceType;
    roles: Role;
    companyName?: string;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
    location?: UserLocation | null;
    wallet?: Wallet;
    // Relations
    providedServices?: Service[];
    clientOrders?: Order[];
    providerOrders?: Order[];
    clientAppointments?: Appointment[];
    providerAppointments?: Appointment[];
    transactions?: Transaction[];
    selectedCategories?: UserCategory[];
    selectedSubcategories?: UserSubcategory[];
    iconId?: string;
    icone?: Icone;
    images?: string;
    cni?: string;
}

export interface Service {
    id: string;
    title: string;
    description?: string;
    pinned?: boolean;
    providerId?: string;
    serviceType: ServiceType;
    basePriceCents?: number;
    subcategoryId?: string;
    // Nouvelle localisation fusionnée (typée)
    location?: UserLocation | null;
    provider?: User;
    iconId?: string;
    icone?: Icone;
    images?: string;
    iconUrl?: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    categoryId?: string;
    category?: ServiceCategory;
    subcategory?: ServiceSubcategory;
    appointments?: Appointment[];
    orderItems?: OrderItem[];
    userLinks?: UserSubcategory[];
}

export interface Rating {
    id: string;
    appointmentId: string;
    clientId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Appointment {
    id: string;
    serviceId: string;
    providerId: string;
    clientId?: string;
    client: User;
    transactionId?: string;
    scheduledAt?: string;
    time?: string;
    durationMins?: number;
    priceCents?: number;
    status: AppointmentStatus;
    providerNotes?: string;
    service: Service;
    rating?: Rating;
    interventionType?: string;
    createdAt: string;
    updatedAt: string;

}

export interface Order {
    id: string;
    clientId?: string;
    providerId?: string;
    transactionId?: string;
    status: OrderStatus;
    totalCents: number;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    serviceId: string;
    quantity: number;
    unitPriceCents: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    userId?: string;
    amountCents: number;
    currency: string;
    status: TransactionStatus;
    description?: any;
    createdAt: string;
    updatedAt: string;
}

// ==========================
// Types
// ==========================
export interface OverviewStats {
    totalUser?: number;
    totalOrders: number;
    totalRevenue: number;
    totalAppointments?: number;
}

export enum HistoryType {
    ORDERS = 'ORDERS',
    APPOINTMENTS = 'APPOINTMENTS',
}

export interface ChartPoint {
    date: string;
    value: number;
}

export interface BarPoint {
    name: string;
    orders: number;
}

export interface PiePoint extends Record<string, string | number> {
    name: string;
    value: number;
}

export interface OverviewProps {
    stats?: OverviewStats;
    chartData?: ChartPoint[];
    barData?: BarPoint[];
    pieData?: PiePoint[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    currency: string;
    category: Category;
    subCategory: SubCategory;
    images?: (string | StaticImageData)[];
    description: string;
    rating: number;
    percentegeRating?: number;
    reviewCount: number;
    isBestSeller: boolean;
    sizes?: string[];
    stock: number;
    tags: string[];
    features: string[];
    seller?: string;
    serviceType?: ServiceType[];
    createdAt: string;
}

export interface SubCategory {
    id: string;
    name: string;
    slug: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    subCategories: SubCategory[];
}

export type CartItem = {
    product: Product;
    quantity: number;
};


export interface CalendarPeriod {
    year: number | string;
    month: number | string;
    monthName: string;
    startDate: string;
    endDate: string;
}

export interface CalendarStats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
}

export interface CalendarResponse {
    appointments: Appointment[];
    appointmentsByDay: Record<string, Appointment[]>;
    period: CalendarPeriod;
    stats: CalendarStats;
}