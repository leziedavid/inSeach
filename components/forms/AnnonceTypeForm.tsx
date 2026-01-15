"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { AnnonceType } from "@/types/interfaces";

// ================= ZOD SCHEMA =================
const typeSchema = z.object({
    types: z.array(z.object({
        id: z.string().optional(),
        label: z.string().min(1, "Le label est requis"),
        description: z.string().optional(),
    }))
});

// ================= TYPES =================
export type AnnonceTypeFormValues = z.infer<typeof typeSchema>;

interface AnnonceTypeFormProps {
    initialData?: AnnonceType; // Objet unique pour update
    isUpdate?: boolean;
    onSubmit: (data: AnnonceTypeFormValues) => Promise<void>;
}

// ================= COMPOSANT =================
export default function AnnonceTypeForm({ initialData, isUpdate = false, onSubmit }: AnnonceTypeFormProps) {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<AnnonceTypeFormValues>({
        resolver: zodResolver(typeSchema),
        defaultValues: {
            types: isUpdate && initialData ? [{ ...initialData }] : [{ label: "", description: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "types"
    });

    const watchFields = watch("types");

    const handleLabelChange = (index: number, val: string) => {
        setValue(`types.${index}.label`, val);
    };

    const handleFormSubmit: SubmitHandler<AnnonceTypeFormValues> = async (data) => {
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 relative">

                    {/* Label input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                        <input
                            {...register(`types.${index}.label` as const)}
                            value={watchFields[index]?.label || ""}
                            onChange={(e) => handleLabelChange(index, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            placeholder="Ex: Vente"
                        />
                        {errors.types?.[index]?.label && (
                            <p className="text-red-500 text-xs mt-1">{errors.types[index]?.label?.message}</p>
                        )}
                    </div>

                    {/* Description input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            {...register(`types.${index}.description` as const)}
                            value={watchFields[index]?.description || ""}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            placeholder="Ex: Vente de biens immobiliers"
                        />
                        {errors.types?.[index]?.description && (
                            <p className="text-red-500 text-xs mt-1">{errors.types[index]?.description?.message}</p>
                        )}
                    </div>

                    {/* Supprimer bouton */}
                    {!isUpdate && fields.length > 1 && (
                        <div className="flex justify-end sm:justify-center sm:items-start mt-2 sm:mt-0 sm:ml-2">
                            <button  type="button" onClick={() => remove(index)}  className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg" aria-label="Supprimer type">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Ajouter une ligne uniquement à la création */}
            {!isUpdate && (
                <button  type="button" onClick={() => append({ label: "", description: "" })} className="flex items-center gap-2 px-4 py-1 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80" >
                    <Plus className="w-4 h-4" />
                    Ajouter un nouveau type
                </button>
            )}

            {/* Submit */}
            <button type="submit" className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/80">
                {isUpdate ? "Mettre à jour" : "Créer un nouveau type"}
            </button>

        </form>
    );
}
