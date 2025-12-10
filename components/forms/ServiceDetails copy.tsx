"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CalendarIcon, Clock, Phone, User, MapPin, Star, ChevronRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Appointment, AppointmentStatus, Service } from "@/types/interfaces";
import KRichEditor from "@/components/forms/KRichEditor";
import { Spinner } from "@/components/forms/spinner/Loader";
import { createAppointment, updateAppointment } from "@/services/appointments";
import { useAlert } from "@/contexts/AlertContext";

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

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onClose, appointment, parentClose, getUserAppointments }) => {

    const [isLoading, setIsLoading] = useState(false);
    // const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(appointment?.scheduledAt ? appointment.scheduledAt.split("T")[0] : "");

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

    const onSubmit = async (values: AppointmentFormValues) => {

        const playload = {
            serviceId: service.id,
            scheduledAt: new Date(`${values.date}T${values.time}:00`).toISOString(),
            time: values.time,
            // priceCents: service.basePriceCents,
            priceCents: 0,
            providerNotes: values.description,
        };

        try {
            setIsLoading(true);
            let res;
            if(appointment?.id) {
                res = await updateAppointment(appointment.id, playload);
            } else {
                res = await createAppointment(playload);
            }
            if (res.statusCode === 201) {
                showAlert(res.message || `Rendez-vous confirmé le ${values.date} à ${values.time}`, "success");
                onClose();
                parentClose?.();
                getUserAppointments?.();
            }else  if (res.statusCode === 200) {
                showAlert(res.message || `Rendez-vous mis à jour le ${values.date} à ${values.time}`, "success");
                onClose();
                parentClose?.();
                getUserAppointments?.();
            }else {
                showAlert(res.message || "Une erreur est survenue.", "error");
            }

            form.reset();
            setSelectedDate("");
            setIsLoading(false);

        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous :", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-1 max-w-md mx-auto mt-4">

            {/* Profile & About Section — uniquement si ce n’est pas une modification */}
            {!appointment && (
                <>

                    {/* Photo & Videos Section */}
                    <div className="mb-3">
                        <div className="w-full h-40 bg-gray-200 rounded-xl relative overflow-hidden">
                            <Image src={service.images || "/images/default-service.jpg"} alt={service.title} fill className="object-cover" unoptimized />
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
                                        className="object-contain" unoptimized
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
                                <span className="text-gray-700 text-xs font-medium">{service.location?.street ?? " "}</span>
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
                    <div className="mb-0">
                        <div className="bg-white p-4">
                            <p
                                dangerouslySetInnerHTML={{ __html: service?.description ?? "" }}
                                className="text-gray-700 leading-relaxed"
                            />
                        </div>
                    </div>
                </>
            )}

            {/* 🗓️ Formulaire */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* 📅 Date */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date du rendez-vous</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                        <Input type="date"  {...field} min={new Date().toISOString().split("T")[0]} onChange={(e) => { field.onChange(e); setSelectedDate(e.target.value); }} className={cn("pl-10 cursor-pointer appearance-none", "focus:ring-2 focus:ring-[#b07b5e] focus:border-[#b07b5e]")} />
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
                                        Choisissez un créneau horaire
                                    </FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                                            {timeSlots.map((slot) => (
                                                <button key={slot} type="button" onClick={() => field.onChange(slot)}
                                                    className={cn("py-2 px-3 rounded-lg text-sm font-medium transition-all", "border hover:scale-105", field.value === slot ? "bg-[#b07b5e] text-white border-[#b07b5e] shadow-md" : "bg-white text-gray-700 border-gray-300 hover:border-[#b07b5e] hover:text-[#b07b5e]")} >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
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
                                <FormLabel>Décrivez votre besoin (facultatif)</FormLabel>
                                <FormControl>
                                    <KRichEditor value={field.value || ""} onChange={field.onChange} maxLength={200} />
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
                        <Button type="submit" disabled={!selectedDate || !form.watch("time")} className={cn("w-full font-semibold transition-all",
                            !selectedDate || !form.watch("time") ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#b07b5e] hover:bg-[#9c6e55] text-white")} >
                            Confirmer le rendez-vous
                        </Button>
                    )}

                </form>
            </Form>

        </div>
    )
}

export default ServiceDetails;