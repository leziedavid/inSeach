
// Request.ts

import { AccountType, Role, UserLocation } from "@/types/interfaces";

export interface Register {
    phone: string;
    companyName: string;
    location: UserLocation | null;
    accountType: AccountType;
    roles: Role;
    serviceCategories: string[];      // array d'ID de catégories
    serviceSubcategories: string[];   // array d'ID de sous-catégories
    password: string;                 // mot de passe à 4 chiffres avec '@' au début
}
