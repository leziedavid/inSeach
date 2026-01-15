"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {CalendarIcon,Clock,Phone, MapPin, Star, ChevronRight,ChevronLeft, Heart, Share2, Image as ImageIcon} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Appointment, Service } from "@/types/interfaces";
import KRichEditor from "@/components/forms/KRichEditor";
import { Spinner } from "@/components/forms/spinner/Loader";
import { createAppointment, updateAppointment } from "@/services/appointments";
import { useAlert } from "@/contexts/AlertContext";
import FormsIntervention, { InterventionType } from "./FormsIntervention";
import LocationMap from "../home/LocationMap";

// ✅ Validation du formulaire
const appointmentSchema = z.object({
    date: z.string().min(1, "Veuillez choisir une date.").refine((val) => !isNaN(Date.parse(val)), "Date invalide."),
    time: z.string().min(1, "Veuillez choisir un créneau horaire."),
    description: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface ServiceDetailsProps {
    service: Service;
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
    // Ajouter la dernière heure
    slots.push(`${endHour.toString().padStart(2, "0")}:00`);
    return slots;
};

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    service,
    onClose,
    appointment,
    parentClose,
    getUserAppointments }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : "");
    const [interventionType, setInterventionType] = useState<InterventionType>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const { showAlert } = useAlert();

    // 📅 Générer les créneaux disponibles
    const timeSlots = useMemo(() => generateTimeSlots(8, 19), []);

    // Gestion des images
    const serviceImages = useMemo(() => {
        if (service.images && typeof service.images === 'string') {
            return [service.images];
        } else if (Array.isArray(service.images)) {
            return service.images;
        }
        return ["/images/default-service.jpg"];
    }, [service.images]);

    const totalImages = serviceImages.length;

    const prevImage = () => {
        setImageIndex((i) => (i === 0 ? totalImages - 1 : i - 1));
    };

    const nextImage = () => {
        setImageIndex((i) => (i === totalImages - 1 ? 0 : i + 1));
    };

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            date: appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : "",
            time: appointment?.time || "",
            description: appointment?.providerNotes || "",
        },
    });

    // Effet pour gérer la sélection automatique en cas d'urgence
    useEffect(() => {
        if (interventionType === "urgence") {
            const now = new Date();

            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTotalMinutes = currentHour * 60 + currentMinute;

            const targetTotalMinutes = currentTotalMinutes + 60; // +1 heure
            const startDayMinutes = 8 * 60;   // 08:00
            const endDayMinutes = 19 * 60;    // 19:00

            let selectedDate = new Date(now);
            let selectedTime = "08:00";

            // 🚨 Si on dépasse 19h → demain à 08h
            if (targetTotalMinutes > endDayMinutes) {
                selectedDate.setDate(selectedDate.getDate() + 1);
                selectedTime = "08:00";
            } else {
                // Trouver le créneau le plus proche >= target
                let nearestTimeSlot = timeSlots[0];

                for (const slot of timeSlots) {
                    const [h, m] = slot.split(":").map(Number);
                    const slotMinutes = h * 60 + m;

                    if (slotMinutes >= targetTotalMinutes) {
                        nearestTimeSlot = slot;
                        break;
                    }
                }

                selectedTime = nearestTimeSlot;
            }

            const formattedDate = selectedDate.toISOString().split("T")[0];

            form.setValue("date", formattedDate);
            form.setValue("time", selectedTime);
            setSelectedDate(formattedDate);

        } else if (interventionType === "rdv") {
            if (!appointment) {
                form.reset({ date: "", time: "", description: "" });
                setSelectedDate("");
            }
        }
    }, [interventionType, form, timeSlots, appointment]);

    const onSubmit = async (values: AppointmentFormValues) => {
        const playload = {
            serviceId: service.id,
            scheduledAt: new Date(`${values.date}T${values.time}:00`).toISOString(),
            time: values.time,
            priceCents: 0,
            providerNotes: values.description,
            interventionType: interventionType // Ajouter le type d'intervention
        };

        try {
            setIsLoading(true);
            let res;
            if (appointment?.id) {
                res = await updateAppointment(appointment.id, playload);
            } else {
                res = await createAppointment(playload);
            }
            if (res.statusCode === 201) {
                showAlert(
                    `Rendez-vous ${interventionType === "urgence" ? "d'urgence" : ""} confirmé le ${values.date} à ${values.time}`,
                    "success"
                );
                onClose();
                parentClose?.();
                getUserAppointments?.();
            } else if (res.statusCode === 200) {
                showAlert(
                    `Rendez-vous ${interventionType === "urgence" ? "d'urgence" : ""} mis à jour le ${values.date} à ${values.time}`,
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
            setInterventionType(null);
            setIsLoading(false);

        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous :", error);
            showAlert("Une erreur est survenue lors de la prise de rendez-vous.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white overflow-hidden">
            {/* SLIDER D'IMAGES */}
            {!appointment && (
                <div className="relative h-64">
                    <Image
                        src={serviceImages[imageIndex]}
                        alt={service.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />

                    {/* Badge de catégorie */}
                    <span className="absolute top-3 left-3 bg-[#b07b5e] text-white text-xs px-3 py-1 rounded-full">
                        {service.category?.name || "Service"}
                    </span>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button className="p-2 bg-white rounded-full shadow">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow">
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Contrôles du slider */}
                    {totalImages > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    {/* Compteur d'images */}
                    <div className="absolute bottom-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        {imageIndex + 1}/{totalImages}
                    </div>
                </div>
            )}

            {/* CONTENU PRINCIPAL */}
            <div className="p-4 space-y-4">
                {/* Titre et Localisation */}
                {!appointment && (
                    <div>
                        <h2 className="font-bold text-lg">{service.title}</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {service.location?.street || "Adresse non renseignée"}
                        </p>
                    </div>
                )}

                {/* Profile Section - seulement si ce n'est pas une modification */}
                {!appointment && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-4 border-white shadow-md">
                                {service.iconUrl ? (
                                    <Image
                                        src={service.iconUrl}
                                        alt={service.icone?.name || "icon"}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-500 text-sm font-bold">
                                        ?
                                    </div>
                                )}
                            </div>

                            {/* Infos du prestataire */}
                            <div>
                                <h3 className="font-semibold text-sm">{service.provider?.name || "Prestataire"}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-xs font-semibold">4.9</span>
                                    <span className="text-xs text-gray-500">(120 avis)</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span className="text-xs">{service.provider?.phone || "+33 6 12 34 56 78"}</span>
                        </div>
                    </div>
                )}

                {/* Badge certifié et rating */}
                {!appointment && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">
                            Disponible maintenant
                        </span>

                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium">
                                4.9/5
                            </span>
                        </div>
                    </div>
                )}

                {/* DESCRIPTION */}
                {!appointment && (
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <p dangerouslySetInnerHTML={{ __html: service?.description ?? "" }} className="leading-relaxed" />
                        </div>
                    </div>
                )}

                {/* FORMULAIRE DE SÉLECTION DU TYPE D'INTERVENTION */}
                {!appointment && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Type d'intervention</h3>
                        <FormsIntervention onSelectionChange={setInterventionType} initialValue={null} />
                    </div>
                )}

                {/* AVERTISSEMENT POUR LES INTERVENTIONS D'URGENCE */}
                {interventionType === "urgence" && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-blue-500">ℹ️</span>
                            <div>
                                <p className="text-blue-800 text-sm font-medium">
                                    Intervention d'urgence sélectionnée
                                </p>
                                <p className="text-blue-700 text-xs mt-1">
                                    Date et heure ajustées automatiquement pour une intervention rapide.
                                    {form.getValues("time") && ` Intervention prévue à ${form.getValues("time")}.`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* FORMULAIRE DE RÉSERVATION */}
                <div className="border-t pt-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            {/* 📅 Date */}
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Date du rendez-vous
                                            {interventionType === "urgence" && " (automatique)"}
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                                <Input type="date"   {...field} min={new Date().toISOString().split("T")[0]} onChange={(e) => { field.onChange(e); setSelectedDate(e.target.value); }} className={cn("pl-10 cursor-pointer appearance-none", "focus:ring-2 focus:ring-[#b07b5e] focus:border-[#b07b5e]", interventionType === "urgence" && "bg-gray-100 cursor-not-allowed")} disabled={interventionType === "urgence"} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
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
                                                <Clock className="h-4 w-4 text-[#b07b5e]" />
                                                {interventionType === "urgence" ? "Créneau horaire d'urgence" : "Choisissez un créneau horaire"}
                                            </FormLabel>
                                            <FormControl>
                                                {interventionType === "urgence" ? (
                                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                        <p className="text-gray-700 font-medium">
                                                            {field.value || "Calcul en cours..."}
                                                        </p>
                                                        <p className="text-gray-600 text-sm mt-1">
                                                            Créneau ajusté automatiquement pour une intervention rapide
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                                        {timeSlots.map((slot) => (
                                                            <button key={slot} type="button" onClick={() => field.onChange(slot)} className={cn("py-2 px-3 rounded-lg text-sm font-medium transition-all", "border hover:scale-105", field.value === slot ? "bg-[#b07b5e] text-white border-[#b07b5e] shadow-md" : "bg-white text-gray-700 border-gray-300 hover:border-[#b07b5e] hover:text-[#b07b5e]")}  >
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
                                            Décrivez votre besoin {interventionType === "urgence" && " (pour urgence)"}
                                        </FormLabel>
                                        <FormControl>
                                            <KRichEditor value={field.value || ""} onChange={field.onChange} maxLength={200} placeholder={interventionType === "urgence" ? "Décrivez l'urgence rapidement..." : "Décrivez votre besoin..."} />
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
                                <Button type="submit" disabled={(!selectedDate || !form.watch("time")) && interventionType !== "urgence"}
                                    className={cn("w-full font-semibold transition-all", ((!selectedDate || !form.watch("time")) && interventionType !== "urgence") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : interventionType === "urgence" ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white" : "bg-[#b07b5e] hover:bg-[#9c6e55] text-white")} >
                                    {interventionType === "urgence" ? "Confirmer l'intervention d'urgence" : "Confirmer le rendez-vous"}
                                </Button>
                            )}
                        </form>
                    </Form>
                </div>


                {/* MAP */}
                <LocationMap location={service?.location} />
            </div>

            {/* FOOTER AVEC PRIX (optionnel) */}
            {!appointment && service.basePriceCents && (
                <div className="sticky bottom-0 bg-white border-t p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Tarif indicatif</p>
                        <p className="font-bold">
                            {service.basePriceCents} ₣ / intervention
                        </p>
                    </div>

                    <div className="text-sm text-gray-600">
                        <span className="block">Satisfaction garantie</span>
                        <span className="text-xs text-gray-500">4.9/5 (120 avis)</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceDetails;