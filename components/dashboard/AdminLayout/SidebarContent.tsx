import { Role } from "@/types/interfaces";
import { MENU_ITEMS } from "./MenuConfig";
import MenuItem from "./MenuItem";

interface SidebarContentProps {
    role?: Role | null;
}

export default function SidebarContent({ role }: SidebarContentProps) {
    const hasValidRole = Boolean(role);

    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full bg-brand-primary" />
                <span className="font-bold text-lg">Admin</span>
            </div>

            {MENU_ITEMS.map((section) => {
                // 🔐 Filtrage des items selon le rôle
                const allowedItems = hasValidRole
                    ? section.items.filter(
                        (item) =>
                            role === "ADMIN" ||
                            item.roles.includes(role as Role)
                    )
                    : [];

                return (
                    <div key={section.section} className="mb-8">
                        {/* Section title */}
                        <div className="text-xs text-gray-400 mb-3">
                            {section.section}
                        </div>

                        <nav className="space-y-2">
                            {/* ✅ Menus autorisés */}
                            {allowedItems.length > 0 &&
                                allowedItems.map((item) => (
                                    <MenuItem
                                        key={item.label}
                                        {...item}
                                    />
                                ))}

                            {/* 🚫 Aucun droit */}
                            {allowedItems.length === 0 && (
                                <div className="text-sm text-gray-400 italic px-2">
                                    Vous n’avez pas accès à ces menus
                                </div>
                            )}
                        </nav>
                    </div>
                );
            })}
            
        </>
    );
}
