"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface KRichEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    className?: string;
    placeholder?: string;
    maxLength?: number;
}

export default function KRichEditor({
    value = "",
    onChange,
    className,
    placeholder = "Écrivez votre description ici...",
    maxLength,
}: KRichEditorProps) {
    const [charCount, setCharCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        content: value || "<p></p>",
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const text = editor.getText();

            // Gestion de la limite de caractères
            if (maxLength && text.length > maxLength) {
                const { from } = editor.state.selection;
                editor.commands.deleteRange({
                    from: maxLength,
                    to: editor.state.doc.content.size,
                });
                const newPos = Math.min(from, maxLength);
                editor.commands.setTextSelection(newPos);
                return;
            }

            setCharCount(text.length);
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class:
                    "tiptap-editable prose prose-sm sm:prose-base focus:outline-none min-h-[80px] max-h-[400px] overflow-y-auto text-gray-800 dark:text-gray-100 px-1 py-0.5",
            },
        },
    });

    // Synchronisation quand la valeur externe change
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
            setCharCount(editor.getText().length);
        }
    }, [value, editor]);

    if (!mounted || !editor) return null;

    // Le placeholder disparaît si l'éditeur n'est pas vide OU si on a une liste active
    const isEditorEmpty =
        editor.isEmpty &&
        !editor.isActive("bulletList") &&
        !editor.isActive("orderedList") &&
        editor.getText().trim().length === 0;

    return (
        <div
            className={cn(
                "border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden relative",
                "bg-white dark:bg-neutral-900 transition-all duration-300 ease-in-out",
                className
            )}
        >
            {/* Barre d'outils */}
            <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-neutral-800">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    Icon={Bold}
                    title="Gras"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    Icon={Italic}
                    title="Italique"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    Icon={Heading2}
                    title="Titre"
                />
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    Icon={List}
                    title="Liste à puces"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    Icon={ListOrdered}
                    title="Liste numérotée"
                />
            </div>

            {/* Zone d'édition */}
            <div className="p-3 relative">
                <div className="relative">
                    <EditorContent editor={editor} />

                    {/* Placeholder animé */}
                    <AnimatePresence>
                        {isEditorEmpty && (
                            <motion.p
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-0 left-0 text-gray-400 dark:text-gray-500 text-sm select-none pointer-events-none px-1 py-0.5"
                            >
                                {placeholder}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Compteur de caractères */}
            {maxLength && (
                <div
                    className={cn(
                        "text-xs text-right px-3 pb-2 transition-colors",
                        charCount >= maxLength
                            ? "text-red-500 dark:text-red-400 font-medium"
                            : "text-gray-500 dark:text-gray-400"
                    )}
                >
                    {charCount}/{maxLength} caractères
                </div>
            )}
        </div>
    );
}

// Bouton de barre d'outils optimisé
interface ToolbarButtonProps {
    onClick: () => void;
    isActive: boolean;
    Icon: any;
    title: string;
}

function ToolbarButton({ onClick, isActive, Icon, title }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={cn(
                "p-2 rounded-md transition-all duration-150 hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            )}
        >
            <Icon size={18} />
        </button>
    );
}

// Styles CSS personnalisés pour les listes
const styles = `
.tiptap-editable ul,
.tiptap-editable ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}

.tiptap-editable ul {
    list-style-type: disc;
}

.tiptap-editable ol {
    list-style-type: decimal;
}

.tiptap-editable li {
    margin: 0.25rem 0;
}

.tiptap-editable li p {
    margin: 0;
}

.tiptap-editable h2 {
    font-size: 1.5em;
    font-weight: 600;
    margin: 0.75rem 0;
}

.tiptap-editable p {
    margin: 0.5rem 0;
}

.tiptap-editable strong {
    font-weight: 600;
}

.tiptap-editable em {
    font-style: italic;
}
`;

// Injection des styles
if (typeof document !== 'undefined') {
    const styleId = 'tiptap-custom-styles';
    if (!document.getElementById(styleId)) {
        const styleTag = document.createElement('style');
        styleTag.id = styleId;
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    }
}