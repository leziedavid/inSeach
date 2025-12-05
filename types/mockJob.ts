export interface Job {
    id: string;
    status: 'active' | 'completed' | 'pending';
    title: string;
    address: string;
    schedule: {
        date: string;
        startTime: string;
        endTime: string;
        duration: string;
    };
    lineItems: LineItem[];
    subtotal: number;
}

export interface LineItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Task {
    id: string;
    name: string;
    completed: boolean;
}