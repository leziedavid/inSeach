import { ShoppingCart, Users, DollarSign } from "lucide-react";
import Image from "next/image";

export default function Dash() {
    return (
        <div className="p-6 space-y-6">

            {/* TOP CARDS */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-100 p-5 rounded-xl flex justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Total customer</p>
                        <h3 className="text-3xl font-bold">39,739</h3>
                    </div>
                    <Users className="text-indigo-600" size={40} />
                </div>

                <div className="bg-teal-100 p-5 rounded-xl flex justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Total sales</p>
                        <h3 className="text-3xl font-bold">15,475</h3>
                    </div>
                    <ShoppingCart className="text-teal-600" size={40} />
                </div>

                <div className="bg-rose-100 p-5 rounded-xl flex justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Total revenue</p>
                        <h3 className="text-3xl font-bold">$7,936</h3>
                    </div>
                    <DollarSign className="text-rose-600" size={40} />
                </div>
            </div>

            {/* GRID 2 COLUMNS */}
            <div className="grid grid-cols-3 gap-6">

                {/* STATISTICS + RECENT */}
                <div className="col-span-2 space-y-6">

                    {/* GRAPH */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold">This year statistics</h3>
                            <div className="text-sm text-gray-500">This year ▼</div>
                        </div>

                        <Image
                            src="/chart-placeholder.png"
                            alt="chart"
                            width={700}
                            height={300}
                            className="rounded"
                        />
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold">Recent activity</h3>
                            <div className="text-sm text-gray-500">This week ▼</div>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    name: "Martin Mitchel",
                                    status: "New Customer",
                                    order: "#00278957",
                                    location: "California",
                                    amount: "$275.00",
                                    img: 12,
                                },
                                {
                                    name: "Cody Fisher",
                                    status: "Signed up",
                                    order: "#00278375",
                                    location: "Miami",
                                    amount: "$320.00",
                                    img: 7,
                                },
                                {
                                    name: "Esther Howard",
                                    status: "New Customer",
                                    order: "#00278790",
                                    location: "New York",
                                    amount: "$290.00",
                                    img: 4,
                                },
                            ].map((u, i) => (
                                <div key={i} className="grid grid-cols-5 items-center text-sm">
                                    <div className="flex items-center gap-3 col-span-2">
                                        <Image
                                            src={`https://i.pravatar.cc/150?img=${u.img}`}
                                            width={35}
                                            height={35}
                                            alt="img"
                                            className="rounded-full"
                                        />
                                        <span className="font-medium">{u.name}</span>
                                    </div>
                                    <span>{u.status}</span>
                                    <span>{u.order}</span>
                                    <span className="font-semibold">{u.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6">

                    {/* MAP */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4">Sales by country</h3>
                        <Image
                            src="/worldmap-placeholder.png"
                            alt="map"
                            width={300}
                            height={150}
                            className="rounded"
                        />
                    </div>

                    {/* CUSTOMER TRANSACTION */}
                    <div className="bg-white p-5 rounded-xl shadow-sm">
                        <h3 className="font-semibold mb-4">Customer transaction</h3>

                        <div className="space-y-4">
                            {[
                                { name: "Martin Mitchel", amount: "-129.25 USD", time: "12:30 PM", img: 3 },
                                { name: "Cody Fisher", amount: "-220.19 USD", time: "1:30 PM", img: 7 },
                                { name: "Jane Cooper", amount: "-374.26 USD", time: "2:30 PM", img: 9 },
                                { name: "Esther Howard", amount: "-179.43 USD", time: "Yesterday", img: 5 },
                                { name: "Darrell Steward", amount: "-149.39 USD", time: "Yesterday", img: 1 },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={`https://i.pravatar.cc/150?img=${t.img}`}
                                            width={35}
                                            height={35}
                                            alt="img"
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="font-medium">{t.name}</p>
                                            <p className="text-xs text-gray-500">{t.time}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">{t.amount}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
