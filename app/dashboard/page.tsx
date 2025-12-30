"use client";

import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import ListeData from "@/components/dashboard/AdminLayout/ListeData";
import { Plus } from "lucide-react";

export default function Page() {

    function StatCard({ title, value, highlight, }: { title: string; value: string; highlight?: boolean; }) {
        return (
            <div
                className={`rounded-2xl p-6 ${highlight ? "bg-brand-primary text-white" : "bg-white"
                    }`}
            >
                <div className="text-sm">{title}</div>
                <div className="text-4xl font-bold mt-2">{value}</div>
                <div className="text-xs mt-2 opacity-80">
                    Increased from last month
                </div>
            </div>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Title */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-500">
                            Plan, prioritize, and accomplish your tasks with ease.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="bg-brand-primary text-white px-3 md:px-5 py-2 rounded-full flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Add Project</span>
                        </button>

                    </div>
                </div>

                {/* Cards - Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Projects" value="24" highlight />
                    <StatCard title="Ended Projects" value="10" />
                    <StatCard title="Running Projects" value="12" />
                    <StatCard title="Pending Project" value="2" />
                </div>

                <ListeData />

            </div>
        </AdminLayout>
    );
}


