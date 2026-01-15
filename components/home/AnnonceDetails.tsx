"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Heart, Share2, Star, ChevronLeft, ChevronRight, Image as ImageIcon, CalendarIcon, Clock, } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Annonce, Appointment } from "@/types/interfaces";
import KRichEditor from "@/components/forms/KRichEditor";
import { Spinner } from "@/components/forms/spinner/Loader";
import { useAlert } from "@/contexts/AlertContext";
import { InterventionType } from "../forms/FormsIntervention";
import FormsAnnonceIntervention from "../forms/FormsAnnoonceIntervention";
import LocationMap from "./LocationMap";
import { createAppointmentAnnonce, updateAppointmentAnnonce } from "@/services/appointmentAnnonceService";

// ✅ Validation du formulaire
const appointmentSchema = z.object({
    date: z.string().min(1, "Veuillez choisir une date d'entrée.").refine((val) => !isNaN(Date.parse(val)), "Date invalide."),
    departureDate: z.string().min(1, "Veuillez choisir une date de départ.").refine((val) => !isNaN(Date.parse(val)), "Date invalide."),
    time: z.string().min(1, "Veuillez choisir un créneau horaire."),
    description: z.string().optional(),
}).refine(
    (data) => {
        // Vérifier que la date de départ est après ou égale à la date d'entrée
        const entryDate = new Date(data.date);
        const departureDate = new Date(data.departureDate);
        return departureDate >= entryDate;
    },
    {
        message: "La date de départ doit être après ou égale à la date d'entrée",
        path: ["departureDate"],
    }
);

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AnnonceDetailsProps {
    annonce?: Annonce | null;
    onClose: () => void;
    appointment?: Appointment;
    parentClose?: () => void;
    getUserAppointments?: () => void;
}

// ⏰ Génération des créneaux horaires (30 min d'intervalle)
const generateTimeSlots = (startHour = 8, endHour = 19) => {
    const slots: string[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    slots.push(`${endHour.toString().padStart(2, "0")}:00`);
    return slots;
};

const AnnonceDetails: React.FC<AnnonceDetailsProps> = ({
    annonce,
    onClose,
    appointment,
    parentClose,
    getUserAppointments
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(
        appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : ""
    );
    const [selectedDepartureDate, setSelectedDepartureDate] = useState<string>(
        appointment?.departureDate || ""
    );
    const [interventionType, setInterventionType] = useState<InterventionType>(null);
    const [index, setIndex] = useState(0);
    const { showAlert } = useAlert();

    // Vérification si annonce existe
    const total = annonce?.images?.length || 0;

    const prev = () => setIndex((i) => (i === 0 ? total - 1 : i - 1));
    const next = () => setIndex((i) => (i === total - 1 ? 0 : i + 1));

    // 📅 Générer les créneaux disponibles
    const timeSlots = useMemo(() => generateTimeSlots(8, 19), []);

    // Fonction pour extraire la date de départ des métadonnées de l'appointment
    const getDepartureDateFromAppointment = (appointment?: Appointment) => {
        if (!appointment) return "";
        if (appointment?.departureDate) {
            return appointment.departureDate.split("T")[0];
        }
        return appointment?.scheduledAt?.split("T")[0]; // Par défaut, même date
    };

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            date: appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : "",
            departureDate: getDepartureDateFromAppointment(appointment),
            time: appointment?.time || "",
            description: appointment?.providerNotes || "",
        },
    });

    // Effet pour synchroniser la date de départ avec la date d'entrée
    useEffect(() => {
        const currentEntryDate = form.getValues("date");
        const currentDepartureDate = form.getValues("departureDate");

        // Si la date de départ est vide ou antérieure à la date d'entrée, on la met à jour
        if (currentEntryDate && (!currentDepartureDate || new Date(currentDepartureDate) < new Date(currentEntryDate))) {
            form.setValue("departureDate", currentEntryDate);
            setSelectedDepartureDate(currentEntryDate);
        }
    }, [form.watch("date")]);

    // Effet pour gérer la sélection automatique en cas d'urgence
    useEffect(() => {
        if (interventionType === "urgence") {
            // Sélectionner la date d'aujourd'hui
            const today = new Date().toISOString().split("T")[0];
            form.setValue("date", today);
            form.setValue("departureDate", today); // Même date pour départ
            setSelectedDate(today);
            setSelectedDepartureDate(today);

            // Calculer l'heure actuelle + 1 heure
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const currentTotalMinutes = currentHour * 60 + currentMinute;
            const targetTotalMinutes = currentTotalMinutes + 60;

            // Trouver le créneau horaire le plus proche
            let nearestTimeSlot = timeSlots[0];
            let smallestDiff = Infinity;

            for (const slot of timeSlots) {
                const [hours, minutes] = slot.split(":").map(Number);
                const slotTotalMinutes = hours * 60 + minutes;
                const diff = Math.abs(slotTotalMinutes - targetTotalMinutes);

                if (diff < smallestDiff && slotTotalMinutes >= targetTotalMinutes) {
                    smallestDiff = diff;
                    nearestTimeSlot = slot;
                }
            }

            if (nearestTimeSlot === timeSlots[0] && targetTotalMinutes > 19 * 60) {
                nearestTimeSlot = timeSlots[timeSlots.length - 1];
            }

            form.setValue("time", nearestTimeSlot);
        } else if (interventionType === "rdv") {
            if (!appointment) {
                form.reset({ date: "", departureDate: "", time: "", description: "" });
                setSelectedDate("");
                setSelectedDepartureDate("");
            }
        }
    }, [interventionType, form, timeSlots, showAlert, appointment]);

    const onSubmit = async (values: AppointmentFormValues) => {
        if (!annonce) {
            showAlert("Aucune annonce sélectionnée.", "error");
            return;
        }

        const payload = {
            annonceId: annonce.id,
            scheduledAt: new Date(`${values.date}T${values.time}:00`).toISOString(),
            time: values.time,
            priceCents: annonce.price * 100,
            providerNotes: values.description,
            interventionType: interventionType,
            entryDate: values.date,
            departureDate: values.departureDate,
            // Calculer le nombre de nuits
            nights: Math.max(1, Math.ceil((new Date(values.departureDate).getTime() - new Date(values.date).getTime()) / (1000 * 60 * 60 * 24))),
            metadata: {
                annonceTitle: annonce.title,
                annonceType: annonce.category,
                rooms: annonce.rooms,
                beds: annonce.beds,
                capacity: annonce.capacity,
            }
        };

        try {
            setIsLoading(true);
            let res;
            if (appointment?.id) {
                res = await updateAppointmentAnnonce(appointment.id, payload);
            } else {
                res = await createAppointmentAnnonce(payload);
            }

            if (res.statusCode === 201) {
                showAlert(
                    `Réservation ${interventionType === "urgence" ? "d'urgence" : ""} confirmée du ${values.date} au ${values.departureDate}`,
                    "success"
                );
                onClose();
                parentClose?.();
                getUserAppointments?.();
            } else if (res.statusCode === 200) {
                showAlert(
                    `Réservation ${interventionType === "urgence" ? "d'urgence" : ""} mise à jour du ${values.date} au ${values.departureDate}`,
                    "success"
                );
                onClose();
                parentClose?.();
                getUserAppointments?.();
            } else {
                showAlert(res.message || "Une erreur est survenue.", "error");
            }

            form.reset();
            setSelectedDate("");
            setSelectedDepartureDate("");
            setInterventionType(null);
            setIsLoading(false);

        } catch (error) {
            console.error("Erreur lors de la réservation :", error);
            showAlert("Une erreur est survenue lors de la réservation.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // Si aucune annonce n'est fournie, afficher un message d'erreur
    if (!annonce) {
        return (
            <div className="max-w-md mx-auto bg-white p-6 text-center">
                <h2 className="font-bold text-lg text-gray-700 mb-2">Aucune annonce sélectionnée</h2>
                <p className="text-gray-500">Veuillez sélectionner une annonce valide.</p>
                <Button onClick={onClose} className="mt-4">
                    Fermer
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white overflow-hidden">
            {/* SLIDER */}
            {annonce.images && annonce.images.length > 0 ? (
                <div className="relative h-64">
                    <Image src={annonce.images[index]}  alt={annonce.title}  fill  className="object-cover" unoptimized/>
                    {annonce.category && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                            {annonce.category.label}
                        </span>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2">
                        <button className="p-2 bg-white rounded-full shadow">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow">
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>

                    {total > 1 && (
                        <>
                            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full" >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full" >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div className="absolute bottom-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {index + 1}/{total}
                    </div>
                </div>
            ) : (
                <div className="relative h-64 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Aucune image disponible</p>
                </div>
            )}

            {/* CONTENT */}
            <div className="p-4 space-y-4">
                <div>
                    <h2 className="font-bold text-lg">{annonce.title}</h2>
                    <p className="text-sm text-gray-500">{annonce.location}</p>
                </div>

                {annonce.certifiedAt && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">
                            Certifié le {annonce.certifiedAt}
                        </span>

                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                                {annonce.rating || 0}/5
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 text-sm text-gray-600">
                    <span>{annonce.rooms || 0} chambre(s)</span>
                    <span>{annonce.beds || 0} lit(s)</span>
                    <span>{annonce.capacity || 0} pers.</span>
                </div>

                {/* DESCRIPTION */}
                <div>
                    <h3 className="font-semibold mb-1">Description</h3>
                    <p className="text-sm text-gray-600">
                        {annonce.description || "Aucune description disponible"}
                    </p>
                </div>

                {/* COMMODITÉS */}
                {annonce.amenities && annonce.amenities.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">Commodités</h3>
                        <div className="flex flex-wrap gap-2">
                            {annonce.amenities.map((a, i) => (
                                <div key={i} className="flex items-center gap-1 px-3 py-3 bg-brand-primary/50 text-white rounded-md text-sm" >
                                    {a.icon && (
                                        <Image  src={`${a.icon}`}  alt={a.label}    width={16}   height={16}  unoptimized   />
                                    )}
                                    {a.label}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* REVIEW */}
                {annonce.review && (
                    <div className="border rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                                {annonce.review.rating || 0}/5
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">
                            {annonce.review.comment}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {annonce.review.author}
                        </p>
                    </div>
                )}

                {/* Formulaire de sélection du type d'intervention - seulement pour les nouveaux RDV */}
                {!appointment && (
                    <div className="mb-6">
                        <FormsAnnonceIntervention onSelectionChange={setInterventionType} />
                    </div>
                )}

                {/* Avertissement pour les interventions d'urgence */}
                {interventionType === "urgence" && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-blue-500">ℹ️</span>
                            <div>
                                <p className="text-blue-800 text-sm font-medium">
                                    Réservation d'urgence sélectionnée
                                </p>
                                <p className="text-blue-700 text-xs mt-1">
                                    Date et heure ajustées automatiquement pour une intervention rapide.
                                    {form.getValues("time") && ` Réservation prévue à ${form.getValues("time")}.`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🗓️ Formulaire de réservation */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* 📅 Date d'entrée */}
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Date d'entrée
                                        {interventionType === "urgence" && " (automatique)"}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="date"
                                                {...field}
                                                min={new Date().toISOString().split("T")[0]}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setSelectedDate(e.target.value);
                                                    // Mettre à jour automatiquement la date de départ si elle est antérieure
                                                    const departureDate = form.getValues("departureDate");
                                                    if (!departureDate || new Date(departureDate) < new Date(e.target.value)) {
                                                        form.setValue("departureDate", e.target.value);
                                                        setSelectedDepartureDate(e.target.value);
                                                    }
                                                }}
                                                className={cn(
                                                    "pl-10 cursor-pointer appearance-none",
                                                    "focus:ring-2 focus:ring-brand-primary focus:border-brand-primary",
                                                    interventionType === "urgence" && "bg-gray-100 cursor-not-allowed"
                                                )}
                                                disabled={interventionType === "urgence"}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 📅 Date de départ */}
                        <FormField
                            control={form.control}
                            name="departureDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Date de départ
                                        {interventionType === "urgence" && " (identique à l'entrée)"}
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                type="date"
                                                {...field}
                                                min={form.getValues("date") || new Date().toISOString().split("T")[0]}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setSelectedDepartureDate(e.target.value);
                                                }}
                                                className={cn(
                                                    "pl-10 cursor-pointer appearance-none",
                                                    "focus:ring-2 focus:ring-brand-primary focus:border-brand-primary",
                                                    interventionType === "urgence" && "bg-gray-100 cursor-not-allowed"
                                                )}
                                                disabled={interventionType === "urgence"}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    {form.getValues("date") && form.getValues("departureDate") && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Durée du séjour: {Math.max(1, Math.ceil(
                                                (new Date(form.getValues("departureDate")).getTime() -
                                                    new Date(form.getValues("date")).getTime()) / (1000 * 60 * 60 * 24)
                                            ))} nuit(s)
                                        </p>
                                    )}
                                </FormItem>
                            )}
                        />

                        {/* 🕒 Créneaux horaires */}
                        {selectedDate && (
                            <FormField
                                control={form.control}
                                name="time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-brand-primary" />
                                            {interventionType === "urgence" ? "Heure d'arrivée (urgence)" : "Heure d'arrivée estimée"}
                                        </FormLabel>
                                        <FormControl>
                                            {interventionType === "urgence" ? (
                                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <p className="text-gray-700 font-medium">
                                                        {field.value || "Calcul en cours..."}
                                                    </p>
                                                    <p className="text-gray-600 text-sm mt-1">
                                                        Heure ajustée automatiquement pour une arrivée rapide
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={() => field.onChange(slot)}
                                                            className={cn(
                                                                "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                                                "border hover:scale-105",
                                                                field.value === slot
                                                                    ? "bg-brand-primary text-white border-brand-primary shadow-md"
                                                                    : "bg-white text-gray-700 border-gray-300 hover:border-brand-primary hover:text-brand-primary"
                                                            )}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* ✍️ Description facultative */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Informations supplémentaires {interventionType === "urgence" && " (pour urgence)"}
                                    </FormLabel>
                                    <FormControl>
                                        <KRichEditor
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            maxLength={200}
                                            placeholder={
                                                interventionType === "urgence"
                                                    ? "Décrivez l'urgence rapidement..."
                                                    : "Ajoutez des informations sur votre séjour..."
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* 🌀 Bouton ou Loader */}
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <Spinner />
                            </div>
                        ) : (
                            <Button
                                type="submit"
                                disabled={(!selectedDate || !selectedDepartureDate || !form.watch("time")) && interventionType !== "urgence"}
                                className={cn(
                                    "w-full font-semibold transition-all",
                                    ((!selectedDate || !selectedDepartureDate || !form.watch("time")) && interventionType !== "urgence")
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : interventionType === "urgence"
                                            ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                                            : "bg-brand-primary hover:bg-brand-primary/90 text-white"
                                )}
                            >
                                {interventionType === "urgence"
                                    ? "Confirmer la réservation d'urgence"
                                    : `Réserver ${form.getValues("date") && form.getValues("departureDate")
                                        ? `(${Math.max(1, Math.ceil(
                                            (new Date(form.getValues("departureDate")).getTime() -
                                                new Date(form.getValues("date")).getTime()) / (1000 * 60 * 60 * 24)
                                        ))} nuit${Math.ceil(
                                            (new Date(form.getValues("departureDate")).getTime() -
                                                new Date(form.getValues("date")).getTime()) / (1000 * 60 * 60 * 24)
                                        ) > 1 ? 's' : ''
                                        })`
                                        : ''
                                    }`
                                }
                            </Button>
                        )}
                    </form>
                </Form>

                {/* MAP */}
                {annonce?.gpsLocation && (
                    <LocationMap location={annonce.gpsLocation} />
                )}
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500">Prix par nuit</p>
                    <p className="font-bold">
                        {(annonce.price || 0).toLocaleString()}  ₣
                    </p>
                    {form.getValues("date") && form.getValues("departureDate") && (
                        <p className="text-sm text-gray-700 mt-1">
                            Total estimé:  {
                                ((annonce.price || 0) * Math.max(1, Math.ceil(
                                    (new Date(form.getValues("departureDate")).getTime() -
                                        new Date(form.getValues("date")).getTime()) / (1000 * 60 * 60 * 24)
                                ))).toLocaleString()
                            }  ₣
                        </p>
                    )}
                </div>

                <div className="text-sm text-gray-600">
                    {annonce.appointments?.length && annonce.appointments[0] ? (
                        <span className="text-red-600 font-medium">Déjà réservé</span>
                    ) : (
                        <span className="text-green-600">Disponible</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnonceDetails;