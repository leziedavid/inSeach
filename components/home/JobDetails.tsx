'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle, Eye, XCircle, Clock, User, FileText, Phone, Mail, SquarePen, Star, Trash2, Calendar } from 'lucide-react';
import Image from "next/image";
import { Appointment, AppointmentStatus, Role } from "@/types/interfaces";
import ServiceDetails from '../forms/ServiceDetails';
import MyModal from '../modal/MyModal';
import { getUserInfos } from '@/app/middleware';
import { updateStatut } from '@/services/appointments';
import { useAlert } from '@/contexts/AlertContext';

interface JobDetailsProps {
    appointment: Appointment;
    parentClose: () => void;
    getUserAppointments: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ appointment, parentClose, getUserAppointments }) => {

    const [activeTab, setActiveTab] = useState<'details' | 'client'>('details');
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false)
    const { showAlert } = useAlert();
    // Simuler le rôle connecté
    const [userRole, setUserRole] = useState<Role>(Role.USER);

    /** Couleurs douces (iOS-style) */
    const statusColors: Record<AppointmentStatus, string> = {
        [AppointmentStatus.CONFIRMED]: "bg-green-50 text-[#b07b5e]",
        [AppointmentStatus.REQUESTED]: "bg-yellow-50 text-yellow-700",
        [AppointmentStatus.PENDING]: "bg-yellow-50 text-yellow-700",
        [AppointmentStatus.CANCELLED]: "bg-red-50 text-red-700",
        [AppointmentStatus.COMPLETED]: "bg-blue-50 text-blue-700",
        [AppointmentStatus.REJECTED]: "bg-gray-50 text-gray-700",
    };

    const statusLabels: Record<AppointmentStatus, string> = {
        CONFIRMED: "Confirmé",
        REQUESTED: "Demandé",
        PENDING: "En attente",
        CANCELLED: "Annulé",
        COMPLETED: "Terminé",
        REJECTED: "Rejeté",
    };

    const scheduledDate = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;

    const formattedDate = scheduledDate?.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // get user role by mildelware
    const getUserRoles = async () => {
        const user = await getUserInfos();
        if (user)
            setUserRole(user?.roles);
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    const OnEditing = () => {
        setIsEditing(true);
        setOpen(true);
    };



    // -------------------------------------------------------------------
    // 🔹 Mettre à jour le statut
    // -------------------------------------------------------------------

    const updateStatus = async (rdv: Appointment, newStatus: AppointmentStatus) => {

        if (newStatus !== AppointmentStatus.COMPLETED) {

            const res = await updateStatut(rdv.id, newStatus);

            if (res.statusCode === 200) {
                showAlert(res.message || `Statut mis à jour avec succès`, "success");
            } else {
                showAlert(res.message || "Une erreur est survenue.", "error");
            }

            getUserAppointments();
        }

        // if (newStatus === AppointmentStatus.COMPLETED) {
        //     setCompletionTarget(rdv);
        //     setOpenCompletionForm(true);
        //     setfinalStatus(newStatus);
        // }

    };


    // -------------------------------------------------------------------
    // 🔥 Rendu des actions selon le statut et le rôle
    // -------------------------------------------------------------------
    const renderActions = (rdv: Appointment) => {
        // USER et CLIENT
        const isClient = userRole === Role.USER || userRole === Role.CLIENT;
        // PROVIDER, ADMIN, SELLER
        const isStaff = userRole === Role.PROVIDER || userRole === Role.ADMIN || userRole === Role.SELLER;

        switch (rdv.status) {

            case AppointmentStatus.PENDING:


                if (isStaff) {
                    return (
                        <>
                            <div className="flex gap-2 w-full max-w-sm mx-auto">
                                <button
                                    onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition"
                                >
                                    <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                                    <span className="truncate">Refuser</span>
                                </button>

                                <button onClick={() => updateStatus(rdv, AppointmentStatus.CONFIRMED)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-[#b07b5e] hover:bg-[#b07b5e]/80 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition" >
                                    <CheckCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                                    <span className="truncate">Accepter</span>
                                </button>
                            </div>
                        </>

                    );
                }

                return (
                    <div className="w-full max-w-sm mx-auto">
                        <button
                            onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                            className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition">
                            <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                            <span className="truncate">Refuser</span>
                        </button>
                    </div>
                );

            case AppointmentStatus.REQUESTED:


                if (isStaff) {
                    return (
                        <>
                            <div className="flex gap-2 w-full max-w-sm mx-auto">
                                <button
                                    onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition"
                                >
                                    <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                                    <span className="truncate">Refuser</span>
                                </button>

                                <button onClick={() => updateStatus(rdv, AppointmentStatus.CONFIRMED)}
                                    className="flex-1 flex items-center justify-center gap-1 bg-[#b07b5e] hover:bg-[#b07b5e]/80 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition" >
                                    <CheckCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                                    <span className="truncate">Accepter</span>
                                </button>
                            </div>
                        </>

                    );
                }

                return (
                    <div className="w-full max-w-sm mx-auto">
                        <button
                            onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                            className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm md:text-sm px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition">
                            <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                            <span className="truncate">Refuser</span>
                        </button>
                    </div>
                );

            case AppointmentStatus.REJECTED:

            case AppointmentStatus.CANCELLED:
                // Tous les rôles peuvent voir Annuler pour leurs propres commandes
                return (
                    <div className="flex items-center gap-1 bg-red-200 hover:bg-red-200 text-red-800 text-[10px] px-2 py-1 rounded-full transition">
                        <Trash2 className="w-3 h-3 text-red-800" />
                        Annuler
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <div className="bg-white p-3">

            {/* Heure minimaliste */}
            <div className="text-right text-gray-400 text-sm mb-3">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>


            {/* CARD PRINCIPALE */}
            <div className="bg-white rounded-2xl overflow-hidden">

                {/* IMAGE */}
                {appointment.service.images && (
                    <div className="relative w-full h-40 rounded-t-2xl overflow-hidden">
                        <Image src={appointment.service.images} alt={appointment.service.title} fill className="object-cover" unoptimized />
                    </div>
                )}

                {/* STATUS */}
                <div className={`px-4 py-3 text-sm ${statusColors[appointment.status]}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${appointment.status === AppointmentStatus.CONFIRMED ? 'bg-green-600' : appointment.status === AppointmentStatus.PENDING ? 'bg-yellow-500' : appointment.status === AppointmentStatus.COMPLETED ? 'bg-blue-600' : appointment.status === AppointmentStatus.CANCELLED ? 'bg-red-600' : 'bg-gray-500'}`} />
                        <span className="font-medium">{statusLabels[appointment.status]}</span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">

                    <div className="flex items-center justify-between mb-3">
                        {/* TITRE */}
                        <h1 className="text-lg font-medium text-gray-900 uppercase">  {appointment.service.title} </h1>
                        {/* Afficher l'icône si le statut permet la modification */}
                        {![AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED,].includes(appointment.status) && (<SquarePen className="w-5 h-5 text-[#b07b5e] cursor-pointer hover:text-[#9c6e55]" onClick={() => OnEditing()} />)}
                    </div>


                    {/* ADRESSE */}
                    <div className="flex items-start gap-2 text-gray-700 mb-4 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            {appointment.service.location && (() => {
                                const loc = typeof appointment.service.location === 'string' ? JSON.parse(appointment.service.location) : appointment.service.location;
                                return (
                                    <>
                                        <p className="font-medium">{loc.country}</p>
                                        <p className="text-sm text-gray-500">
                                            {loc.city}, {loc.district}
                                        </p>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* DATE + HEURE */}
                    <div className="rounded-xl p-3 mb-5 bg-gray-50 text-sm space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{appointment.time} ({appointment.durationMins} min)</span>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="flex border-b border-gray-100 mb-4 text-sm">
                        <button className={`flex-1 py-2 transition ${activeTab === 'details' ? 'text-[#b07b5e] border-b-2 border-[#b07b5e]' : 'text-gray-400'}`} onClick={() => setActiveTab('details')}  >
                            Détails
                        </button>

                        <button className={`flex-1 py-2 transition ${activeTab === 'client' ? 'text-[#b07b5e] border-b-2 border-[#b07b5e]' : 'text-gray-400'}`}
                            onClick={() => setActiveTab('client')} >
                            Client
                        </button>
                    </div>

                    {/* DETAILS */}
                    {activeTab === 'details' && (
                        <div className="space-y-4 text-sm">

                            {/* PRIX */}
                            <div className="flex items-center justify-between p-3 bg-[#f6f1ed] rounded-xl">
                                <div className="flex items-center gap-2"> ₣
                                    <span className="font-medium">Prix de base</span>
                                </div>
                                <span className="text-sm font-semibold">
                                    {(appointment.service.basePriceCents || 0)}  ₣
                                </span>
                            </div>

                            {/* PRIX AFICHIER UNIQUEMENT SI LE ROLE EST PROVIDER */}
                            {userRole === Role.PROVIDER && (
                                <div className="flex items-center justify-between p-3 bg-[#0f4c5b]/30 rounded-xl">
                                    <div className="flex items-center gap-2"> ₣
                                        <span className="font-medium">Gain realisé</span>
                                    </div>
                                    <span className="text-sm font-semibold">
                                        {(appointment.priceCents || 0)}  ₣
                                    </span>
                                </div>
                            )}

                            {/* NOTES */}
                            {appointment.rating && (
                                <>
                                    <div className="p-3 bg-yellow-50 rounded-xl text-sm">
                                        <span className="font-medium text-yellow-700">Note. du clients</span>

                                        <div className="flex items-center gap-1 mb-1 mt-2">
                                            {[...Array(appointment.rating.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 text-yellow-600" />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <p className="text-yellow-800" dangerouslySetInnerHTML={{ __html: appointment?.rating?.comment ?? '' }} />
                                        </div>
                                    </div>
                                </>
                            )}


                            {/* DESCRIPTION */}
                            <div className="p-3 bg-gray-50 rounded-xl text-sm">
                                <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: appointment.service?.description ?? '' }} />
                            </div>


                            {appointment.providerNotes && (
                                <div className="p-3 bg-yellow-50 rounded-xl text-sm">
                                    <div className="flex items-center gap-1 mb-1">
                                        <FileText className="w-3 h-3 text-yellow-600" />
                                        <span className="font-medium text-yellow-700">Notes</span>
                                    </div>
                                    <p className="text-yellow-800" dangerouslySetInnerHTML={{ __html: appointment?.providerNotes ?? '' }} />
                                </div>
                            )}

                            {/* ajouter les bouton daction ici */}
                            {renderActions(appointment)}
                        </div>
                    )}

                    {/* CLIENT */}
                    {activeTab === 'client' && (
                        <div className="space-y-4 text-sm">

                            {/* CARD CLIENT */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-[#e8dace] rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-[#b07b5e]" />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">
                                            {appointment.client.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">{appointment.client.phone}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    {appointment.client.phone && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{appointment.client.phone}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{appointment.client.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* INFO RDV */}
                            <div className="bg-blue-50 rounded-xl p-3 text-sm">
                                <h4 className="font-medium text-blue-900 mb-1">Informations</h4>
                                <div className="space-y-1 text-blue-800">
                                    <p>Créé le {new Date(appointment.createdAt).toLocaleDateString('fr-FR')}</p>
                                    <p>Mis à jour le {new Date(appointment.updatedAt).toLocaleDateString('fr-FR')}</p>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

            </div>


            {isEditing && (
                <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                    <ServiceDetails service={appointment.service}
                        onClose={() => setIsEditing(false)}
                        appointment={appointment} // tu peux passer l'appointment si tu veux pré-remplir
                        parentClose={parentClose}
                        getUserAppointments={getUserAppointments}
                    />
                </MyModal>
            )}

        </div>
    );
};

export default JobDetails;
