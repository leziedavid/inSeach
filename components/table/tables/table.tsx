'use client';

import React, { ReactNode, useState } from "react";
import { Table as ShadTable, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"; // table shadcn
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    Repeat,
    Users,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Column<T> {
    key: keyof T | string; // autoriser string pour colonnes custom
    name: string;
    render?: (item: T) => ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onDelete?: (item: T) => void;
    onUpdate?: (item: T) => void;
    onActive?: (item: T) => void;
    onAffecte?: (item: T) => void;
    onChange?: (item: T) => void;
    onDeleteMultiple?: (items: T[]) => void;
    enableMultiple?: boolean;
    currentPage?: number;
    totalItems?: number;
    itemsPerPage?: number;
    onNextPage?: () => void;
    onPreviousPage?: () => void;
}

export function Table<T extends { id: string | number }>({
    data,
    columns,
    onDelete,
    onUpdate,
    onActive,
    onAffecte,
    onChange,
    onDeleteMultiple,
    enableMultiple = false,
    currentPage = 1,
    totalItems = 0,
    itemsPerPage = 10,
    onNextPage,
    onPreviousPage,
}: TableProps<T>) {
    const [selectedItems, setSelectedItems] = useState<Set<T["id"]>>(new Set());

    const toggleSelect = (id: T["id"]) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedItems(newSet);
    };

    const handleDeleteMultiple = () => {
        if (onDeleteMultiple) {
            const itemsToDelete = data.filter((item) => selectedItems.has(item.id));
            onDeleteMultiple(itemsToDelete);
            setSelectedItems(new Set());
        }
    };

    return (
        <div className="w-full">
            {enableMultiple && selectedItems.size > 0 && (
                <div className="mb-2">
                    <Button variant="destructive" onClick={handleDeleteMultiple}>
                        Supprimer ({selectedItems.size}) sélectionnés
                    </Button>
                </div>
            )}

            <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-full inline-block align-middle">
                        <ShadTable  className="w-full table-auto">
                            <TableHeader>
                                <TableRow>
                                    {enableMultiple && (
                                        <TableHead>
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.size === data.length && data.length > 0}
                                                onChange={(e) => {
                                                    if (e.target.checked)
                                                        setSelectedItems(new Set(data.map((d) => d.id)));
                                                    else setSelectedItems(new Set());
                                                }}
                                            />
                                        </TableHead>
                                    )}
                                    {columns.map((col) => (
                                        <TableHead key={String(col.key)}>{col.name}</TableHead>
                                    ))}
                                    {(onDelete || onUpdate || onActive || onChange) && (
                                        <TableHead className="text-right">Actions</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((item) => (
                                    <TableRow key={item.id}>
                                        {enableMultiple && (
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.has(item.id)}
                                                    onChange={() => toggleSelect(item.id)}
                                                />
                                            </TableCell>
                                        )}
                                        {columns.map((col) => (
                                            <TableCell key={String(col.key)}>
                                                {col.render
                                                    ? col.render(item)
                                                    : String((item as any)[col.key] ?? "")}
                                            </TableCell>
                                        ))}
                                        {(onDelete || onUpdate || onActive || onChange) && (
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">

                                                        {onAffecte && (
                                                            <DropdownMenuItem onClick={() => onAffecte(item)}>
                                                                <Users className="h-4 w-4 mr-2" /> Affecter un conducteur
                                                            </DropdownMenuItem>
                                                        )}

                                                        {onUpdate && (
                                                            <DropdownMenuItem onClick={() => onUpdate(item)}>
                                                                <Edit className="h-4 w-4 mr-2" /> Modifier
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onDelete && (
                                                            <DropdownMenuItem onClick={() => onDelete(item)}>
                                                                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onActive && (
                                                            <DropdownMenuItem onClick={() => onActive(item)}>
                                                                <CheckCircle className="h-4 w-4 mr-2" /> Activer
                                                            </DropdownMenuItem>
                                                        )}

                                                        {onChange && (
                                                            <DropdownMenuItem onClick={() => onChange(item)}>
                                                                <Repeat className="h-4 w-4 mr-2" /> Changer
                                                            </DropdownMenuItem>
                                                        )}


                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </ShadTable>

                    </div>
                </div>
            </div>

            {/* Pagination stylisée */}
            {(onNextPage || onPreviousPage) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
                    <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                        Page {currentPage} sur {Math.ceil(totalItems / itemsPerPage)}
                    </div>

                    <div className="flex justify-center sm:justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPreviousPage}
                            disabled={currentPage <= 1}
                            className="text-xs sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Précédent</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNextPage}
                            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Suivant</span>
                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
