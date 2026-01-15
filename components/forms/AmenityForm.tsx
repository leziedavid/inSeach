"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { X, Upload } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Amenity } from "@/types/interfaces";

// ========== ZOD SCHEMA ==========
const amenitySchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Le label est requis"),
    images: z.array(z.any()).optional(), // fichiers image
});

// ========== TYPES ==========
export type AmenityFormValues = z.infer<typeof amenitySchema>;

interface AmenityFormProps {
    initialData?: Amenity; // pour modification
    onSubmit: (data: FormData) => Promise<void>;
    onClose: () => void;
    isSubmitting?: boolean;
}

// ========== COMPONENT ==========
export default function AmenityForm({ initialData, onSubmit, onClose, isSubmitting = false }: AmenityFormProps) {
    const [preview, setPreview] = useState<string | null>(initialData?.icon || null);
    const [file, setFile] = useState<File | null>(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AmenityFormValues>({
        resolver: zodResolver(amenitySchema),
        defaultValues: {
            id: initialData?.id,
            label: initialData?.label || "",
        }
    });

    // Watch label pour debug si besoin
    const watchedLabel = watch("label");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
        }
    };

    const handleFormSubmit: SubmitHandler<AmenityFormValues> = async (data) => {
        const formData = new FormData();
        if (data.id) formData.append("id", data.id);
        formData.append("label", data.label);

        // Ajouter l'image si uploadée
        if (file) formData.append("images", file);

        // Sinon, si modification et preview existe, on peut envoyer l'URL existante
        else if (preview && !file) formData.append("images", preview);

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {/* Label */}
            <div>
                <label className="block text-md font-medium text-gray-700 mb-1">Label *</label>
                <input  type="text"   {...register("label")}  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label.message}</p>}
            </div>

            {/* Icon / Image */}
            <div>
                <label className="block text-md font-medium text-gray-700 mb-1">Icône / Image</label>
                <div className="flex items-center gap-4">
                    <label className="relative w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                    </label>
                    {preview && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                            <button type="button" onClick={() => { setPreview(null); setFile(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Annuler</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/80">
                    {isSubmitting ? "Enregistrement..." : (initialData?.id ? "Mettre à jour" : "Créer")}
                </button>
            </div>

        </form>
    );
}
