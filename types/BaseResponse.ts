// app/interfaces/ApiResponse.ts
export interface BaseResponse<T> {
    statusCode: any;
    message: string;
    data?: T;
}

// Exemple : structure attendue du body JSON
export interface PaymentResponse {
    id: string;
    amount: number;
    status: string;
    // ajoute ici les autres champs que l’API de Wave renvoie
}