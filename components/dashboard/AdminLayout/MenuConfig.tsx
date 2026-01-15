import {LayoutDashboard, ListTodo,Calendar,BarChart3,Users,Settings, HelpCircle,LogOut,} from "lucide-react";
import { Role } from "@/types/interfaces";

export interface MenuConfigItem {
    label: string;
    icon: any;
    href: string;
    roles: Role[];
    badge?: string;
}

export interface MenuSection {
    section: string;
    items: MenuConfigItem[];
}

export const MENU_ITEMS: MenuSection[] = [
    {
        section: "MENU",
        items: [
            {
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/dashboard",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Utilisateurs",
                icon: ListTodo,
                href: "/dashboard/users",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Services",
                icon: ListTodo,
                href: "/dashboard/services",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
                        {
                label: "Categories",
                icon: ListTodo,
                href: "/dashboard/serviceCategories",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Rendez-vous",
                icon: ListTodo,
                href: "/dashboard/appointments",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },

            {
                label: "Orders",
                icon: ListTodo,
                href: "/dashboard/commands",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Category-annonce",
                icon: ListTodo,
                href: "/dashboard/category-annonce",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Équipements annonce",
                icon: ListTodo,
                href: "/dashboard/amenity-annonce",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            {
                label: "Types d'annonce",
                icon: ListTodo,
                href: "/dashboard/Annonce-type",
                roles: [Role.ADMIN, Role.MANAGER, Role.PROVIDER],
            },
            
            {
                label: "Calendar",
                icon: Calendar,
                href: "/dashboard/calendar",
                roles: [Role.ADMIN, Role.USER, Role.PROVIDER],
            },
            {
                label: "Analytics",
                icon: BarChart3,
                href: "/analytics",
                roles: [Role.ADMIN, Role.PROVIDER],
            },
            {
                label: "Team",
                icon: Users,
                href: "/team",
                roles: [Role.ADMIN, Role.PROVIDER],
            },
        ],
    },
    {
        section: "GENERAL",
        items: [
            {
                label: "Settings",
                icon: Settings,
                href: "/settings",
                roles: [Role.ADMIN, Role.USER, Role.PROVIDER],
            },
            {
                label: "Help",
                icon: HelpCircle,
                href: "/help",
                roles: [Role.ADMIN, Role.MANAGER, Role.USER],
            },
            {
                label: "Logout",
                icon: LogOut,
                href: "/logout",
                roles: [ Role.ADMIN, Role.MANAGER, Role.USER, Role.CLIENT, Role.PROVIDER, Role.SELLER ],
            },
        ],
    },
];
