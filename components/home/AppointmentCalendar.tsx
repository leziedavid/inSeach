"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Loader2 } from "lucide-react";
import { Appointment, AppointmentStatus, CalendarResponse } from "@/types/interfaces";
import MyModal from "../modal/MyModal";
import JobDetails from "./JobDetails";
import { getCalendarData } from "@/services/appointments";

interface AppointmentCalendarProps {
    appointments?: Appointment[];
    onAppointmentSelect?: (appointment: Appointment) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments: propAppointments, onAppointmentSelect }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDateAppointments, setShowDateAppointments] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);

    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    // 🔄 Chargement des données du calendrier

    const fetchCalendarData = async () => {
        // Si on passe des appointments en props, on ne fetch pas depuis l'API
        if (propAppointments) {
            setAppointments(propAppointments);
            return;
        }

        setIsLoading(true);
        try {
            const response = await getCalendarData(
                currentDate.getFullYear(),
                currentDate.getMonth()
            );

            if (response.statusCode === 200 && response.data) {
                const calendarData = response.data;
                setCalendarData(calendarData);
                setAppointments(calendarData.appointments || []);
            }
        } catch (error) {
            console.error('Erreur chargement calendrier:', error);
            // On peut garder un état vide ou afficher un message d'erreur
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, [currentDate.getMonth(), currentDate.getFullYear(), propAppointments]);

    // 🧮 Génération des jours du mois
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Lundi = 0

        const days: (Date | null)[] = [];

        // Jours vides avant le début du mois
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }

        // Jours du mois
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    // 🗓️ Regroupement des rendez-vous par jour
    const appointmentsByDay = useMemo(() => {
        const map = new Map<string, Appointment[]>();

        // Utiliser les données pré-calculées de l'API si disponibles
        if (calendarData?.appointmentsByDay) {
            Object.entries(calendarData.appointmentsByDay).forEach(([key, value]) => {
                // L'API retourne "2025-11-3" (mois 0-indexé) - adapter si nécessaire
                map.set(key, value);
            });
            return map;
        }

        // Sinon calculer localement
        appointments.forEach((apt) => {
            if (apt.scheduledAt) {
                const date = new Date(apt.scheduledAt);
                // Formater la clé comme l'API : "2025-11-3"
                const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                if (!map.has(key)) map.set(key, []);
                map.get(key)?.push(apt);
            }
        });

        return map;
    }, [appointments, calendarData]);

    // 🔄 Navigation
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getAppointmentsForDay = (date: Date | null): Appointment[] => {
        if (!date) return [];
        // Formater la clé comme dans appointmentsByDay
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        return appointmentsByDay.get(key) || [];
    };

    const isToday = (date: Date | null): boolean => {
        if (!date) return false;
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // 🧭 Gestion des clics
    const handleDateClick = (date: Date | null) => {
        if (!date) return;
        const dayAppointments = getAppointmentsForDay(date);
        if (dayAppointments.length > 0) {
            setSelectedDate(date);
            setShowDateAppointments(true);
        }
    };

    const handleAppointmentSelect = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setShowDateAppointments(false);

        // Appeler le callback si fourni
        if (onAppointmentSelect) {
            onAppointmentSelect(appointment);
        } else {
            // Sinon ouvrir le modal
            setOpen(true);
        }
    };

    // 🎨 Couleurs des statuts
    const getStatusColor = (status: AppointmentStatus): string => {
        const colors: Record<AppointmentStatus, string> = {
            [AppointmentStatus.CONFIRMED]: "bg-green-500",
            [AppointmentStatus.REQUESTED]: "bg-yellow-500",
            [AppointmentStatus.PENDING]: "bg-yellow-500",
            [AppointmentStatus.CANCELLED]: "bg-red-500",
            [AppointmentStatus.COMPLETED]: "bg-blue-500",
            [AppointmentStatus.REJECTED]: "bg-red-700",
        };
        return colors[status] || "bg-gray-400";
    };

    // Formater l'heure pour l'affichage
    const formatAppointmentTime = (apt: Appointment): string => {
        if (!apt.scheduledAt) return "Heure non définie";

        const date = new Date(apt.scheduledAt);
        const timeStr = date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const durationStr = apt.durationMins ? ` • ${apt.durationMins} min` : "";
        return `${timeStr}${durationStr}`;
    };

    return (

        <>
            {appointments && appointments.length > 0 && (

                <div className="w-full max-w-4xl mx-auto p-0 mt-4">
                    {/* En-tête */}
                    <div className="bg-white rounded-2xl shadow-sm">

                        <div className="flex items-center justify-between p-4">
                            <button onClick={prevMonth} disabled={isLoading} className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50" >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-gray-900">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                {isLoading && (
                                    <Loader2 className="w-4 h-4 text-[#b07b5e] animate-spin" />
                                )}
                            </div>

                            <button onClick={nextMonth} disabled={isLoading} className="p-2 hover:bg-gray-50 rounded-full transition-colors disabled:opacity-50" >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Jours de la semaine */}
                        <div className="grid grid-cols-7 gap-1 px-2 pb-2">
                            {daysOfWeek.map((day) => (
                                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2" >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grille du calendrier */}
                        <div className="grid grid-cols-7 gap-1 p-2">
                            {calendarDays.map((date, idx) => {
                                const dayAppointments = getAppointmentsForDay(date);
                                const isCurrentDay = isToday(date);
                                const hasAppointments = dayAppointments.length > 0;

                                return (
                                    <div key={idx} className={` aspect-square p-1 rounded-xl transition-all duration-200  ${date ? `bg-white hover:bg-gray-50 cursor-pointer border border-transparent ${isCurrentDay ? "ring-2 ring-blue-500 ring-opacity-50" : ""} ${hasAppointments ? "bg-[#b07b5e]/10 hover:bg-[#b07b5e]/20 border-[#b07b5e]/30" : ""}` : "bg-transparent"} `} onClick={() => handleDateClick(date)} >
                                        {date && (
                                            <>
                                                <div className={` text-xs font-semibold text-center mb-1 ${isCurrentDay ? "text-blue-600" : hasAppointments ? "text-[#b07b5e]" : "text-gray-700"} `}>
                                                    {date.getDate()}
                                                </div>
                                                {hasAppointments && (
                                                    <div className="flex justify-center">
                                                        <div className="w-1 h-1 rounded-full bg-[#b07b5e]" />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>

                    {/* 📅 Modal des rendez-vous du jour */}
                    {showDateAppointments && selectedDate && (
                        <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 px-4" onClick={() => setShowDateAppointments(false)} >
                            <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto no-scrollbar shadow-xl" onClick={(e) => e.stopPropagation()} >
                                {/* En-tête */}
                                <div className="sticky top-0 bg-white px-4 py-3 border-b flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-gray-900">  Rendez-vous du{" "}
                                        {selectedDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", })}
                                    </h2>
                                    <button onClick={() => setShowDateAppointments(false)} className="p-2 hover:bg-gray-100 rounded-full" >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Liste des rendez-vous */}
                                <div className="p-4">
                                    {getAppointmentsForDay(selectedDate).length === 0 ? (
                                        <div className="text-center py-8 text-gray-500"> Aucun rendez-vous pour ce jour </div>) : (
                                        <div className="space-y-2">
                                            {getAppointmentsForDay(selectedDate).map((apt) => (
                                                <button
                                                    key={apt.id}
                                                    onClick={() => handleAppointmentSelect(apt)}
                                                    className="w-full text-left p-3 rounded-xl transition-all duration-200  hover:bg-[#b07b5e]/10 border border-gray-100 bg-white"  >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                                                            {apt.service?.title || "Service"}
                                                        </h3>
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${getStatusColor(apt.status)}`}
                                                            title={apt.status} />
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{formatAppointmentTime(apt)}</span>
                                                        </div>
                                                        {apt.priceCents && (
                                                            <span className="font-medium">
                                                                {(apt.priceCents / 100).toFixed(2)} ₣
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🧾 Modal de détails du rendez-vous */}
                    {selectedAppointment && !onAppointmentSelect && (
                        <MyModal open={open} onClose={() => setOpen(false)}>
                            <JobDetails appointment={selectedAppointment} parentClose={() => setOpen(false)} getUserAppointments={() => fetchCalendarData()} />
                        </MyModal>
                    )}
                </div>

            )}

        </>
    );
};

export default AppointmentCalendar;