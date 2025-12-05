// data/fakeUsers.ts
import {
    User,
    Role,
    AccountType,
    Wallet,
    Service,
    ServiceType,
    Transaction,
    ServiceCategory,
    ServiceSubcategory,
    TransactionStatus,
    UserStatus,
} from "@/types/interfaces";
import { fakeCategories, fakeSubcategories } from "./fackeSimules";

/**
 * NOTE:
 * - Les objets `Service`, `Wallet`, `Transaction` sont volontairement simplifiés pour le front.
 * - Ajuste les imports/chemins si nécessaire selon ta structure de projet.
 */

const now = new Date().toISOString();

const sampleCategory: ServiceCategory = {
    id: "cat1",
    name: "Services généraux",
    description: "Catégorie exemple",
    createdAt: now,
    updatedAt: now,
};

const sampleSubcat: ServiceSubcategory = {
    id: "sub1",
    name: "Nettoyage",
    description: "Nettoyage à domicile et véhicule",
    categoryId: sampleCategory.id,
    serviceType: [ServiceType.MIXED],
    createdAt: now,
    updatedAt: now,
};


const walletClient: Wallet = {
    id: "w-client-1",
    userId: "user-client-1",
    balanceCents: 15000, // 150.00 (assuming cents)
    currency: "XOF",
    createdAt: now,
    updatedAt: now,
};

const walletProvider: Wallet = {
    id: "w-provider-1",
    userId: "user-provider-1",
    balanceCents: 500000, // 5000.00
    currency: "XOF",
    createdAt: now,
    updatedAt: now,
};

const tx1: Transaction = {
    id: "tx-1",
    userId: "user-client-1",
    amountCents: 100000, // 1000 F
    currency: "XOF",
    status: TransactionStatus.PENDING,
    description: "Paiement recharge wallet",
    createdAt: now,
    updatedAt: now,
};

const tx2: Transaction = {
    id: "tx-2",
    userId: "user-provider-1",
    amountCents: 250000, // 2500 F reçu
    currency: "XOF",
    status: TransactionStatus.COMPLETED,
    description: "Paiement service - nettoyage",
    createdAt: now,
    updatedAt: now,
};

export const fakeUsers: User[] = [
    {
        id: "user-1",
        email: "alice.pro@example.com",
        name: "Alice Dupont",
        phone: "+33612345678",
        typeCompte: AccountType.INDIVIDUAL,
        roles: [Role.PROVIDER],
        status: UserStatus.ACTIVE,
        companyName: "Alice Services",
    
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "user-2",
        email: "bob.enterprise@example.com",
        name: "Bob Martin",
        phone: "+33698765432",
        typeCompte: AccountType.SELLER,
        status: UserStatus.ACTIVE,
        roles: [Role.PROVIDER],
        companyName: "Martin Solutions",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "user-3",
        email: "alice.pro@example.com",
        name: "Alice Dupont",
        phone: "+33612345678",
        typeCompte: AccountType.INDIVIDUAL,
        status: UserStatus.INACTIVE,
        roles: [Role.CLIENT],
        companyName: "Alice Services",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "user-4",
        email: "bob.enterprise@example.com",
        name: "Bob Martin",
        phone: "+33698765432",
        typeCompte: AccountType.SELLER,
        status: UserStatus.BLOCKED,
        roles: [Role.PROVIDER],
        companyName: "Martin Solutions",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export default fakeUsers;
