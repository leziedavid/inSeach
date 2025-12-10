"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { CalendarIcon, Clock, Phone, User, MapPin, Star, ChevronRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Appointment, AppointmentStatus, Service } from "@/types/interfaces";
import KRichEditor from "@/components/forms/KRichEditor";
import { Spinner } from "@/components/forms/spinner/Loader";
import { createAppointment, updateAppointment } from "@/services/appointments";
import { useAlert } from "@/contexts/AlertContext";
import FormsIntervention, { InterventionType } from "./FormsIntervention"; // Import du composant FormsIntervention

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
    getUserAppointments
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>( appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : "");
    const [interventionType, setInterventionType] = useState<InterventionType>(null);
    const { showAlert } = useAlert();

    // 📅 Générer les créneaux disponibles
    const timeSlots = useMemo(() => generateTimeSlots(8, 19), []);

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
            // Sélectionner la date d'aujourd'hui
            const today = new Date().toISOString().split("T")[0];
            form.setValue("date", today);
            setSelectedDate(today);

            // Calculer l'heure actuelle + 1 heure
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Convertir l'heure en minutes depuis minuit
            const currentTotalMinutes = currentHour * 60 + currentMinute;
            const targetTotalMinutes = currentTotalMinutes + 60; // +1 heure

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

            // Si on dépasse les créneaux disponibles, prendre le dernier
            if (nearestTimeSlot === timeSlots[0] && targetTotalMinutes > 19 * 60) {
                nearestTimeSlot = timeSlots[timeSlots.length - 1];
            }

            form.setValue("time", nearestTimeSlot);

        } else if (interventionType === "rdv") {
            // Réinitialiser pour rendez-vous normal
            if (!appointment) {
                form.reset({ date: "",  time: "",  description: ""  });
                setSelectedDate("");
            }
        }
    }, [interventionType, form, timeSlots, showAlert, appointment]);

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
        <div className="bg-white p-1 max-w-md mx-auto mt-4">
            {/* Profile & About Section — uniquement si ce n'est pas une modification */}
            {!appointment && (
                <>
                    {/* Photo & Videos Section */}
                    <div className="mb-3">
                        <div className="w-full h-40 bg-gray-200 rounded-xl relative overflow-hidden">
                            <Image
                                src={service.images || "/images/default-service.jpg"}
                                alt={service.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#b07b5e]/50 to-[#b07b5e]/50 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            <span className="text-white font-bold text-xl">
                                {service.iconUrl ? (
                                    <Image
                                        src={service.iconUrl}
                                        alt={service.icone?.name || "icon"}
                                        width={28}
                                        height={28}
                                        className="object-contain"
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-sm font-semibold text-white text-gray-500"> ? </span>
                                )}
                            </span>
                        </div>

                        <div className="flex-1">
                            <h2 className="font-medium text-gray-900 text-lg uppercase">{service.title}</h2>

                            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium mt-1">
                                <div className="flex items-center space-x-1 mt-1">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-xs font-semibold text-gray-900">4.9</span>
                                    </div>
                                    <span className="text-xs text-gray-600">(120 Avis)</span>
                                </div>
                                <MapPin className="w-4 h-4 text-[#b07b5e]" />
                                <span className="text-gray-700 text-xs font-medium">
                                    {service.location?.street ?? " "}
                                </span>
                            </div>

                            {/* Nom + Téléphone */}
                            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium mt-1">
                                <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                <span className="text-xs">{service.provider?.name || "Prestataire"}</span>
                                <Phone className="w-4 h-4 text-[#b07b5e]" />
                                <span className="text-xs">{service.provider?.phone || "+33612345678"}</span>
                            </div>
                        </div>
                    </div>

                    {/* About Me Section */}
                    <div className="mb-4">
                        <div className="bg-white p-4">
                            <p
                                dangerouslySetInnerHTML={{ __html: service?.description ?? "" }}
                                className="text-gray-700 leading-relaxed"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* Formulaire de sélection du type d'intervention - seulement pour les nouveaux RDV */}
            {!appointment && (
                <div className="mb-6">
                    <FormsIntervention
                        onSelectionChange={setInterventionType}
                        initialValue={null}
                    />
                </div>
            )}

            {/* Avertissement pour les interventions d'urgence */}
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

            {/* 🗓️ Formulaire de réservation */}
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
                                        <Input
                                            type="date"
                                            {...field}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSelectedDate(e.target.value);
                                            }}
                                            className={cn(
                                                "pl-10 cursor-pointer appearance-none",
                                                "focus:ring-2 focus:ring-[#b07b5e] focus:border-[#b07b5e]",
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

                    {/* 🕒 Créneaux horaires */}
                    {selectedDate && (
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[#b07b5e]" />
                                        {interventionType === "urgence"
                                            ? "Créneau horaire d'urgence"
                                            : "Choisissez un créneau horaire"}
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
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => field.onChange(slot)}
                                                        className={cn(
                                                            "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                                                            "border hover:scale-105",
                                                            field.value === slot
                                                                ? "bg-[#b07b5e] text-white border-[#b07b5e] shadow-md"
                                                                : "bg-white text-gray-700 border-gray-300 hover:border-[#b07b5e] hover:text-[#b07b5e]"
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
                                    Décrivez votre besoin {interventionType === "urgence" && " (pour urgence)"}
                                </FormLabel>
                                <FormControl>
                                    <KRichEditor
                                        value={field.value || ""}
                                        onChange={field.onChange}
                                        maxLength={200}
                                        placeholder={
                                            interventionType === "urgence"
                                                ? "Décrivez l'urgence rapidement..."
                                                : "Décrivez votre besoin..."
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
                            disabled={(!selectedDate || !form.watch("time")) && interventionType !== "urgence"}
                            className={cn(
                                "w-full font-semibold transition-all",
                                ((!selectedDate || !form.watch("time")) && interventionType !== "urgence")
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : interventionType === "urgence"
                                        ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                                        : "bg-[#b07b5e] hover:bg-[#9c6e55] text-white"
                            )}
                        >
                            {interventionType === "urgence"
                                ? "Confirmer l'intervention d'urgence"
                                : "Confirmer le rendez-vous"}
                        </Button>
                    )}
                </form>
            </Form>
        </div>
    );
};

export default ServiceDetails;