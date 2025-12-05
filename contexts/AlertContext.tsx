"use client";

import AlertToster, { AlertType } from "@/components/modal/AlertToster";
import { createContext, useContext, useState, ReactNode } from "react";

interface AlertContextType {
    showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextType>({
    showAlert: () => { },
});

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alert, setAlert] = useState<{ message: string; type: AlertType } | null>(null);

    const showAlert = (message: string, type: AlertType = "info", duration = 4000) => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), duration + 300);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && (
                <AlertToster
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);
