"use client";

import React, { useState, useEffect, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
    multiple?: boolean;
    maxSizeMB?: number;
    initialPreviews?: string[];
    onSelect: (files: File[] | null) => void;
}

export default function ImageUploader({
    multiple = false,
    maxSizeMB = 20,
    initialPreviews = [],
    onSelect,
}: ImageUploaderProps) {
    const [previews, setPreviews] = useState<string[]>(initialPreviews);
    const [loadingPreviews, setLoadingPreviews] = useState<boolean[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setPreviews(initialPreviews);
    }, [initialPreviews]);

    const processFiles = (files: FileList | null) => {
        if (!files) return;

        const validFiles: File[] = [];
        const tempLoading: boolean[] = [];

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                setError("Format non supporté. Utilisez PNG, JPG ou JPEG.");
                return;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`Le fichier ${file.name} dépasse ${maxSizeMB}MB.`);
                return;
            }

            validFiles.push(file);
            tempLoading.push(true);
        });

        if (validFiles.length === 0) return;

        setError(null);
        setLoadingPreviews((prev) => [...prev, ...tempLoading]);
        setPreviews((prev) => [...prev, ...new Array(tempLoading.length).fill("pending")]);

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => {
                    const updated = [...prev];
                    const pendingIndex = updated.findIndex((p) => p === "pending");
                    if (pendingIndex !== -1) updated[pendingIndex] = reader.result as string;
                    return updated;
                });
                setLoadingPreviews((prev) => {
                    const updated = [...prev];
                    const loadingIndex = updated.findIndex((_, i) => prev[i]);
                    if (loadingIndex !== -1) updated[loadingIndex] = false;
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });

        onSelect(multiple ? validFiles : [validFiles[0]]);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        e.target.value = "";
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        setPreviews((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            if (updated.length === 0) onSelect(null);
            return updated;
        });
        setLoadingPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Zone principale d'upload */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center w-full min-h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all relative ${isDragging ? "border-[#a06a50] bg-[#a06a50]/10" : "border-gray-300 hover:border-[#a06a50]"
                    }`}
            >
                <div className="flex flex-col items-center justify-center p-5 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG, JPEG (MAX. {maxSizeMB}MB)</p>
                </div>
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            {/* Aperçu des images */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                    {previews.map((src, i) => (
                        <div key={i} className="relative w-24 h-24">
                            {loadingPreviews[i] || src === "pending" ? (
                                <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.2s_infinite]" />
                                    <style jsx>{`
                                        @keyframes shimmer {
                                            0% {
                                                background-position: -200px 0;
                                            }
                                            100% {
                                                background-position: 200px 0;
                                            }
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                src && (
                                    <>
                                        <Image
                                            src={src}
                                            alt={`preview-${i}`}
                                            fill
                                            className="object-cover rounded-lg border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-gray-600 hover:text-red-500 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )
                            )}
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
    );
}
