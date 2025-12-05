// Composant Overview corrigé avec le typage proper pour percent
import React from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps, } from "recharts";
import { Users, ShoppingBag, HandCoins, CalendarDays, PieChart as PieIcon, LineChart as LineIcon, BarChart2, } from "lucide-react";
import AppointmentCalendar from "../page/AppointmentCalendar";
import { BarPoint, ChartPoint, OverviewProps, OverviewStats, PiePoint } from "@/types/interfaces";

// ==========================
// Données par défaut
// ==========================
export const defaultStats: OverviewStats = {
    totalUser: 2480,
    totalOrders: 1320,
    totalRevenue: 985000,
    totalAppointments: 743,
} as const;

export const defaultChartData: ChartPoint[] = [
    { date: "Jan", value: 120 },
    { date: "Feb", value: 180 },
    { date: "Mar", value: 240 },
    { date: "Apr", value: 210 },
    { date: "May", value: 320 },
    { date: "Jun", value: 410 },
];

export const defaultBarData: BarPoint[] = [
    { name: "Prestation", orders: 400 },
    { name: "Livraison", orders: 300 },
    { name: "Produit", orders: 500 },
];

export const defaultPieData: PiePoint[] = [
    { name: "Clients", value: 65 },
    { name: "Providers", value: 25 },
    { name: "Guests", value: 10 },
];

// ==========================
// COMPOSANT PRINCIPAL
// ==========================
export default function Overview({ stats = defaultStats, chartData = defaultChartData, barData = defaultBarData, pieData = defaultPieData }: OverviewProps = { stats: defaultStats, chartData: defaultChartData, barData: defaultBarData, pieData: defaultPieData }) {

    // Fonction de rendu pour les labels du PieChart
    const renderPieLabel = (props: PieLabelRenderProps) => {
        const { name, percent } = props;
        if (typeof percent === 'number') {
            return `${name} ${(percent * 100).toFixed(0)}%`;
        }
        return name;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full space-y-6"
        >
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MotionWrap>
                    <StatCard
                        title="Utilisateurs"
                        value={(stats?.totalUser ?? 0).toLocaleString()}
                        icon={<Users className="w-6 h-6" />}
                    />
                </MotionWrap>

                <MotionWrap>
                    <StatCard
                        title="Commandes"
                        value={(stats?.totalOrders ?? 0).toLocaleString()}
                        icon={<ShoppingBag className="w-6 h-6" />}
                    />
                </MotionWrap>

                <MotionWrap>
                    <StatCard
                        title="Revenus"
                        value={`${(stats?.totalRevenue ?? 0).toLocaleString()} FCFA`}
                        icon={<HandCoins className="w-6 h-6" />}
                    />
                </MotionWrap>

                <MotionWrap>
                    <StatCard
                        title="Rendez-vous"
                        value={(stats?.totalAppointments ?? 0).toLocaleString()}
                        icon={<CalendarDays className="w-6 h-6" />}
                    />
                </MotionWrap>
            </div>


            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GraphCard title="Statistiques Mensuelles" icon={<LineIcon className="w-5 h-5" />}>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </GraphCard>

                <GraphCard title="Types de commandes" icon={<BarChart2 className="w-5 h-5" />}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </GraphCard>

                <GraphCard title="Répartition des utilisateurs" icon={<PieIcon className="w-5 h-5" />}>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value" label={renderPieLabel} >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={`hsl(var(--primary) / ${0.6 + index * 0.2})`} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value}%`, "Pourcentage"]} />
                        </PieChart>
                    </ResponsiveContainer>
                </GraphCard>
            </div>

            {/* Calendrier */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                <div className="w-full max-w-md mx-auto p-4">
                    <AppointmentCalendar />
                </div>
            </motion.div>

        </motion.div>
    );
}

// ==========================
// SOUS-COMPOSANTS
// ==========================
interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
    return (
        <div className="p-4 flex items-center gap-4 border rounded-xl border-gray-200 bg-white transition-all">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <h3 className="text-xl font-semibold">{value}</h3>
            </div>
        </div>
    );
}

interface GraphCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function GraphCard({ title, icon, children }: GraphCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}  >
            <div className="">
                <div className="flex flex-row items-center gap-2 pb-4">
                    {icon}
                    <p className="text-lg font-medium">{title}</p>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

function MotionWrap({ children }: { children: React.ReactNode }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
        </motion.div>
    );
}