import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
    icon: any;
    label: string;
    href: string;
    badge?: string;
}

export default function MenuItem({
    icon: Icon,
    label,
    href,
    badge,
}: MenuItemProps) {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Link href={href}>
            <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer
                ${ active  ? "bg-brand-primary text-white"  : "text-gray-600 hover:bg-gray-100" }`} >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                </div>

                {badge && (
                    <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
        </Link>
    );
}
