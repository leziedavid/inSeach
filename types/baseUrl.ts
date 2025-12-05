
// On récupère la variable d'environnement ou on met une valeur par défaut
// const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'http://localhost:4000/api/v1';
const BASE_URL = process.env.NEXT_PUBLIC_SERVEUR_URL || 'https://dev.peoogo.com/api/v1';

export const getBaseUrl = (): string => {
    return BASE_URL;
};
