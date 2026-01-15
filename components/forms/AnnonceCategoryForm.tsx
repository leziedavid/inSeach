"use client";

import { useForm, useFieldArray, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { categoriesAnnonce } from "@/types/interfaces";

// ================= ZOD SCHEMA =================
const categorySchema = z.object({
    categories: z.array(z.object({ id: z.string().optional(), value: z.string().min(1, "Le value est requis"), label: z.string().min(1, "Le label est requis"), })
    )
});

// ================= TYPES =================
export type CategoryFormValues = z.infer<typeof categorySchema>;

interface AnnonceCategoryFormProps {
    initialData?: categoriesAnnonce; // Objet unique en modification
    isUpdate?: boolean;
    onSubmit: (data: CategoryFormValues) => Promise<void>;
}

// ================= COMPOSANT =================
export default function AnnonceCategoryForm({ initialData, isUpdate = false, onSubmit }: AnnonceCategoryFormProps) {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            categories: isUpdate && initialData ? [initialData] : [{ value: "", label: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "categories"
    });

    // Watch value pour mettre à jour label automatiquement
    const watchFields = watch("categories");

    const handleValueChange = (index: number, val: string) => {
        setValue(`categories.${index}.value`, val);
        setValue(`categories.${index}.label`, val); // Prérempli label avec la valeur
    };

    const handleFormSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
        
        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

            {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 relative">

                    {/* Value input */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la catégorie</label>
                        <input  {...register(`categories.${index}.value` as const)} value={watchFields[index]?.value || ""} onChange={(e) => handleValueChange(index, e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent" placeholder="Ex: Appartement" />
                        {errors.categories?.[index]?.value && (
                            <p className="text-red-500 text-xs mt-1">{errors.categories[index]?.value?.message}</p>
                        )}
                    </div>

                    {/* Label input prérempli et readonly */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Label (slug)</label>
                        <input   {...register(`categories.${index}.label` as const)} value={watchFields[index]?.label || ""} readOnly className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed" />
                        {errors.categories?.[index]?.label && (
                            <p className="text-red-500 text-xs mt-1">{errors.categories[index]?.label?.message}</p>
                        )}
                    </div>

                    {/* Supprimer bouton */}
                    {!isUpdate && fields.length > 1 && (
                        <div className="flex justify-end sm:justify-center sm:items-start mt-2 sm:mt-0 sm:ml-2">
                            <button type="button" onClick={() => remove(index)} className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg" aria-label="Supprimer catégorie"   >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Ajouter une ligne uniquement à la création */}
            {!isUpdate && (
                <button type="button" onClick={() => append({ value: "", label: "" })} className="flex items-center gap-2 px-4 py-1 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80"  >
                    <Plus className="w-4 h-4" />
                    Ajouter une nouvelle ligne
                </button>
            )}

            {/* Submit */}
            <button type="submit" className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/80"  >
                {isUpdate ? "Mettre à jour" : "Créer une nouvelle catégorie"}
            </button>

        </form>
    );
}
