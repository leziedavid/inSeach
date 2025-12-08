"use client";

import React from "react";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Appointment, AppointmentStatus } from "@/types/interfaces";

interface AppointmentDetailsProps {
    appointment: Appointment;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment }) => {
    const statusColors: Record<AppointmentStatus, string> = {
        [AppointmentStatus.CONFIRMED]: "bg-green-100 text-green-800",
        [AppointmentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
        [AppointmentStatus.CANCELLED]: "bg-red-100 text-red-800",
        [AppointmentStatus.COMPLETED]: "bg-blue-100 text-blue-800",
        [AppointmentStatus.REJECTED]: "bg-gray-100 text-gray-800",
        [AppointmentStatus.REQUESTED]: "bg-gray-100 text-gray-800",
        
    };

    const statusLabels: Record<AppointmentStatus, string> = {
        [AppointmentStatus.CONFIRMED]: "Confirmé",
        [AppointmentStatus.PENDING]: "En attente",
        [AppointmentStatus.CANCELLED]: "Annulé",
        [AppointmentStatus.COMPLETED]: "Terminé",
        [AppointmentStatus.REJECTED]: "Rejeté",
        [AppointmentStatus.REQUESTED]: "En attente",
    };

    const scheduledDate = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;

    return (
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto no-scrollbar">
            {/* 🖼️ Image du service */}
            {appointment.service.images && (
                <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
                    <Image
                        src={appointment.service.images}
                        alt={appointment.service.title}
                        fill
                        className="object-cover" unoptimized
                    />
                </div>
            )}

            {/* 📄 Contenu principal */}
            <div className="p-6 space-y-6">
                {/* 🧾 Titre */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {appointment.service.title}
                    </h2>
                    {appointment.service.description && (
                        <p className="text-gray-600 leading-relaxed">
                            {appointment.service.description}
                        </p>
                    )}
                </div>

                {/* 🗓️ Détails date & heure + 👤 Client (version fluide) */}
                <div className="space-y-3">
                    {scheduledDate && (
                        <>
                            {/* 📅 Date */}
                            <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                                <div className="bg-[#b07b5e]/10 p-3 rounded-full">
                                    <Calendar className="text-[#b07b5e]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Date du rendez-vous</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {scheduledDate.toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* 🕒 Heure */}
                            <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                                <div className="bg-[#b07b5e]/10 p-3 rounded-full">
                                    <Clock className="text-[#b07b5e]" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Heure</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {scheduledDate.toLocaleTimeString("fr-FR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {appointment.durationMins && ` (${appointment.durationMins} min)`}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* 👤 Client */}
                    {appointment.client && (
                        <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="bg-[#b07b5e]/10 p-3 rounded-full">
                                <User className="text-[#b07b5e]" size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Client</h4>
                                <p className="text-sm text-gray-600 mt-1">{appointment.client.name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 📌 Statut */}
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut</span>
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}
                    >
                        {statusLabels[appointment.status]}
                    </span>
                </div>

                {/* 📝 Notes */}
                {appointment.providerNotes && (
                    <div className="pt-3 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Notes du client
                        </h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-xl leading-relaxed">
                            {appointment.providerNotes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetails;
