"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Eye, XCircle, Star, Trash2, Phone, MessageCircle } from "lucide-react";
import Pagination from "../pagination/Paginations";
import { Spinner } from "../forms/spinner/Loader";
import { Appointment, AppointmentStatus, Role } from "@/types/interfaces";
import MyModal from "../modal/MyModal";
import JobDetails from "./JobDetails";
import Erreurs from "./Erreurs";
import { getUserInfos } from "@/app/middleware";
import { addRatingOfAppointment, listAppointments, updateStatut } from "@/services/appointments";
import { useAlert } from "@/contexts/AlertContext";
import { Historytype } from "@/app/history/page";

interface RendezVousProps {
    type: Historytype;
}

export default function RendezVous({ type }: RendezVousProps) {

    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 4;

    // Simuler le rôle connecté
    const [userRole, setUserRole] = useState<Role>(Role.USER);
    const [appointment, setAppointment] = useState<Appointment[]>([]);

    // Modal détails
    const [open, setOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Modal rating
    const [openRating, setOpenRating] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<Appointment | null>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");

    // Formulaire réalisation
    const [openCompletionForm, setOpenCompletionForm] = useState(false);
    const [completionTarget, setCompletionTarget] = useState<Appointment | null>(null);
    const [completionValue, setCompletionValue] = useState("");
    const [finalStatus, setfinalStatus] = useState<AppointmentStatus>(AppointmentStatus.COMPLETED);

    const statusLabels: Record<AppointmentStatus, string> = {
        CONFIRMED: "Confirmé",
        REQUESTED: "Demandé",
        PENDING: "En attente",
        CANCELLED: "Annulé",
        COMPLETED: "Terminé",
        REJECTED: "Rejeté",
    };

    // get user role by mildelware
    const getUserRoles = async () => {
        const user = await getUserInfos();
        if (user)
            setUserRole(user?.roles);
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    // get user all Appointments
    const getUserAppointments = async () => {
        try {
            setIsLoading(true);

            const items = await listAppointments(page);
            if (items.statusCode === 200 && items.data) {
                setAppointment(items.data.data);
                setTotalPages(items.data.total);
            }

        } catch (error) {
            console.error("Erreur lors de la récupération des rendez-vous :", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserAppointments();
    }, [page, itemsPerPage]);


    // -------------------------------------------------------------------
    // Gestion des modals
    // -------------------------------------------------------------------
    const handleAppointmentSelect = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setOpen(true);
    };

    const openRatingForm = (rdv: Appointment) => {
        setRatingTarget(rdv);
        setOpenRating(true);
    };

    const handleSubmitRating = async () => {
        console.log("Rating:", rating, "Comment:", comment, "Appointment:", ratingTarget);

        if (!ratingTarget) {
            showAlert("Erreur: rendez-vous non trouvé.", "error");
            return;
        }

        const res = await addRatingOfAppointment(ratingTarget.id, rating, comment);
        if (res.statusCode === 200) {
            showAlert(res.message || `Rating ajouté avec succès`, "success");
            setOpenRating(false);
            setRating(0);
            setHoverRating(0);
            setComment("");
        } else {
            showAlert(res.message || "Une erreur est survenue.", "error");
        }
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

        if (newStatus === AppointmentStatus.COMPLETED) {
            setCompletionTarget(rdv);
            setOpenCompletionForm(true);
            setfinalStatus(newStatus);
        }

    };

    const onSubmit = async () => {

        console.log("Service réalisé à :", completionValue, completionTarget);

        if (!completionTarget?.id) {
            return;
        }

        const amount = Number(completionValue);
        if (Number.isNaN(amount)) {
            showAlert("Veuillez entrer un nombre valide.", "error");
            return;
        }
        const res = await updateStatut(completionTarget.id, finalStatus, amount);

        if (res.statusCode === 200) {
            showAlert(res.message || `Statut mis à jour avec succès`, "success");
            getUserAppointments();

        } else {
            showAlert(res.message || "Une erreur est survenue.", "error");
            getUserAppointments();
        }

        setOpenCompletionForm(false);
        setCompletionValue("");
        setCompletionTarget(null);
    }

    const statusStyleMap: Record<AppointmentStatus, string> = {
        PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
        REQUESTED: "bg-blue-100 text-blue-700 border border-blue-200",
        CONFIRMED: "bg-emerald-100 text-emerald-700 border border-emerald-200",
        COMPLETED: "bg-indigo-100 text-indigo-700 border border-indigo-200",
        REJECTED: "bg-red-100 text-red-700 border border-red-200",
        CANCELLED: "bg-gray-100 text-gray-600 border border-gray-200",
    };


    // affichage des bouton d'allerte

    // Vérifie si le rendez-vous est aujourd'hui et si on est à moins de 30 min avant l'heure
    const isAppointmentNear = (scheduledAt: string, time: string) => {
        if (!scheduledAt || !time) return false;
        const now = new Date();
        // Date du rendez-vous
        const scheduledDate = new Date(scheduledAt);
        // Vérifier si c'est aujourd'hui
        const isToday =
            scheduledDate.getFullYear() === now.getFullYear() &&
            scheduledDate.getMonth() === now.getMonth() &&
            scheduledDate.getDate() === now.getDate();

        if (!isToday) return false;

        // Heure du rendez-vous
        const [hours, minutes] = time.split(":").map(Number);
        const appointmentTime = new Date(scheduledDate);
        appointmentTime.setHours(hours, minutes, 0, 0);
        // Calculer la différence en minutes
        const diffMinutes = (appointmentTime.getTime() - now.getTime()) / 1000 / 60;
        // Si on est dans la plage -30min à +0min (30 min avant le rendez-vous)
        return diffMinutes <= 30 && diffMinutes >= 0;
    };


    // -------------------------------------------------------------------
    // 🔥 Rendu des actions selon le statut et le rôle
    // -------------------------------------------------------------------
    const renderActions = (rdv: Appointment) => {
        // USER et CLIENT
        const isClient = userRole === Role.USER || userRole === Role.CLIENT;
        // PROVIDER, ADMIN, SELLER
        const isStaff = userRole === Role.PROVIDER || userRole === Role.ADMIN || userRole === Role.SELLER;

        // Badge du statut

        switch (rdv.status) {

            case AppointmentStatus.PENDING:
            case AppointmentStatus.REQUESTED:

                if (isStaff) {
                    return (
                        <>
                            <div className="flex gap-2">
                                <button onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)} className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition" >
                                    <XCircle className="w-3 h-3 text-white" />
                                    Refuser
                                </button>

                                <button onClick={() => updateStatus(rdv, AppointmentStatus.CONFIRMED)} className="flex items-center gap-1 bg-[#b07b5e] text-white hover:bg-[#b07b5e]/80 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition" >
                                    <CheckCircle className="w-3 h-3 text-white" />
                                    Accepter
                                </button>
                            </div>


                        </>
                    );
                }
                return (
                    <div className="w-full flex gap-2">
                        <button onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                            className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition" >
                            <XCircle className="w-3 h-3 text-gray-500" />
                            Refuser
                        </button>
                    </div>
                );

            case AppointmentStatus.CONFIRMED:

                if (isStaff) {
                    return (
                        <div className="flex gap-2">

                            <button onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)} className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition"  >
                                <XCircle className="w-3 h-3 white" />
                                Refuser
                            </button>

                            <button onClick={() => updateStatus(rdv, AppointmentStatus.COMPLETED)} className="flex items-center gap-1 bg-[#155e75] text-white hover:bg-[#155e75]/80 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition"  >
                                <CheckCircle className="w-3 h-3 text-white" />
                                Terminer
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="w-full flex gap-2">
                        <button onClick={() => updateStatus(rdv, AppointmentStatus.REJECTED)}
                            className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-600 text-sm md:text-sm px-2 md:px-3 py-1 md:py-1 rounded-lg transition" >
                            <XCircle className="w-3 h-3 text-gray-500" />
                            Refuser
                        </button>
                    </div>
                );

            case AppointmentStatus.COMPLETED:
                if (isClient) {
                    return (
                        <div className="flex gap-2">
                            <button onClick={() => openRatingForm(rdv)} className="flex items-center gap-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-[10px] px-2 py-1 rounded-full transition"  >
                                <Star className="w-3 h-3 text-yellow-600" />
                                Noter
                            </button>
                            <div className="flex items-center text-green-800 text-[10px] transition">
                                {statusLabels[rdv.status]}
                            </div>
                        </div>
                    );
                }
                return null; // STAFF ne peut pas noter

            case AppointmentStatus.REJECTED:

            default:
                return null;
        }

    };

    return (

        <>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 mt-2">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">  <Calendar className="w-4 h-4" /> Rendez-vous </h3>
            </div>

            {/* Liste des RDV */}

            <div className="space-y-3 mb-5">
                {/* <pre>{JSON.stringify(appointment.length, null, 2)}</pre> */}
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>

                ) : appointment.length > 0 ? (

                    appointment.map((rdv, i) => {
                        const isDisabled = rdv.status === AppointmentStatus.REJECTED || rdv.status === AppointmentStatus.CANCELLED;

                        return (
                            <div key={i} className={`relative flex flex-col border rounded-xl p-3 hover:shadow-md transition  bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 ${isDisabled ? "opacity-50 pointer-events-none" : ""} `} >

                                {/* 🔥 Boutons Appel / WhatsApp 30 min avant */}
                                {rdv.scheduledAt && rdv.time && isAppointmentNear(rdv.scheduledAt, rdv.time) && (
                                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                        <button onClick={() => window.open(`tel:${rdv.service.provider?.phone || ""}`)} className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce hover:scale-105 transition-transform"  >
                                            <Phone className="w-3 h-3" />
                                            Appel
                                        </button>
                                        <button onClick={() => window.open(`https://wa.me/${rdv.service.provider?.phone || ""}`)} className="flex items-center gap-1 bg-[#25D366] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce hover:scale-105 transition-transform" >
                                            <MessageCircle className="w-3 h-3" />
                                            WhatsApp
                                        </button>
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex flex-row gap-2 z-10">
                                    <button onClick={() => window.open(`tel:${rdv.service.provider?.phone || ""}`)} className="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce hover:scale-105 transition-transform" >
                                        <Phone className="w-3 h-3" />
                                        Appel
                                    </button>
                                    <button onClick={() => window.open(`https://wa.me/${rdv.service.provider?.phone || ""}`)} className="flex items-center gap-1 bg-[#25D366] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce hover:scale-105 transition-transform" >
                                        <MessageCircle className="w-3 h-3" />
                                        WhatsApp
                                    </button>
                                </div>


                                {/* TITRE + DATE */}
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{rdv.service.title}</p>
                                        <p className="text-xs text-gray-500">{rdv.time}</p>
                                    </div>


                                    <span className="flex items-center gap-2 text-xs px-2 py-1 rounded-md">
                                        {/* Badge dynamique selon interventionType */}
                                        {rdv.interventionType === "urgence" ? (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-md font-bold text-[10px] whitespace-nowrap">  Urgent </span>
                                        ) : (
                                            <span className="bg-[#b07b5e22] text-[#b07b5e] px-2 py-1 rounded-md font-bold text-[10px] whitespace-nowrap">Rendez-vous </span>
                                        )}

                                        {/* Date avec espace */}
                                        <span className="text-xs bg-[#b07b5e22] text-[#b07b5e] px-2 py-1 rounded-md" >
                                            {rdv.scheduledAt ? new Date(rdv.scheduledAt).getUTCDate().toString().padStart(2, "0") : "-"}
                                        </span>
                                    </span>

                                </div>

                                {/* Actions + Badge + Eye */}
                                <div className="flex items-end justify-between gap-x-1 mt-2 w-full">

                                    {/* GAUCHE */}
                                    <div className="flex">
                                        {renderActions(rdv)}
                                    </div>

                                    {/* DROITE */}
                                    <div className="flex items-center gap-2">
                                        {rdv.status !== "REQUESTED" && rdv.status !== "PENDING" && (
                                            <span className={` px-3 py-1  rounded-full text-xs font-medium transition-all duration-200   hover:scale-105    hover:shadow-sm  ${statusStyleMap[rdv.status]} `}>
                                                {statusLabels[rdv.status]}
                                            </span>
                                        )}

                                        <button onClick={() => handleAppointmentSelect(rdv)} className="bg-white hover:bg-[#b07b5e] rounded-full shadow p-1.5 text-gray-500 hover:text-white" >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>

                            </div>
                        );
                    })

                ) : (

                    <div className="flex justify-center py-1">
                        <Erreurs />
                    </div>
                )}
            </div>

            <Pagination page={page} onPageChange={setPage} itemsPerPage={itemsPerPage} totalItems={totalPages} />

            {/* Modal détails */}
            {selectedAppointment && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <JobDetails
                        appointment={selectedAppointment}
                        parentClose={() => setOpen(false)}
                        getUserAppointments={() => getUserAppointments()} />
                </MyModal>
            )}

            {/* Modal Notation */}
            {ratingTarget && (
                <MyModal open={openRating} onClose={() => setOpenRating(false)}>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-700 mb-3 text-sm">Noter la prestation</h3>

                        {/* ⭐ Étoiles interactives */}
                        <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`w-6 h-6 cursor-pointer transition-colors  ${star <= (hoverRating || rating) ? "text-yellow-400" : "text-gray-300"}  `}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(rating)}
                                />
                            ))}
                        </div>

                        {/* Commentaire */}
                        <textarea
                            className="w-full border rounded-lg p-2 text-sm"
                            placeholder="Votre commentaire..."
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)} />

                        <button className="mt-3 bg-[#b07b5e] text-white px-4 py-2 rounded-lg text-sm" onClick={handleSubmitRating} >
                            Envoyer
                        </button>
                    </div>
                </MyModal>
            )}

            {/* Modal Formulaire Réalisation */}
            {completionTarget && (
                <MyModal open={openCompletionForm} onClose={() => setOpenCompletionForm(false)}>
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-700 mb-3 text-sm">
                            À combien avez-vous réalisé ce service ?
                        </h3>

                        <input
                            type="number"
                            className="w-full border rounded-lg p-2 text-sm"
                            value={completionValue}
                            onChange={(e) => setCompletionValue(e.target.value)}
                            placeholder="Entrez un nombre..."
                        />

                        <button onClick={() => { onSubmit() }} className="mt-3 bg-[#b07b5e] text-white px-4 py-2 rounded-lg text-sm w-full items-center justify-center" >
                            Valider
                        </button>
                    </div>
                </MyModal>
            )}
        </>

    );
}
