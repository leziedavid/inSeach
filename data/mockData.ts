import { Job, Task } from "@/types/mockJob";


export const mockJob: Job = {
    id: '1',
    status: 'active',
    title: 'Work for Lawn Care - Aerate a Lawn',
    address: '1285 Oak Lane NW',
    schedule: {
        date: 'Aug 10',
        startTime: '11:30 am',
        endTime: '13:20 pm',
        duration: '1h 20min'
    },
    lineItems: [
        {
            id: '1',
            name: 'Mow',
            quantity: 1,
            price: 320.00,
            total: 320.00
        }
    ],
    subtotal: 320
};

export const mockTasks: Task[] = [
    { id: '1', name: 'Inspect lawn condition', completed: true },
    { id: '2', name: 'Aerate entire lawn', completed: false },
    { id: '3', name: 'Clean up debris', completed: false },
    { id: '4', name: 'Final inspection', completed: false }
];