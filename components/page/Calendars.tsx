"use client"

import { useState } from "react"
import { Calendar, Package } from "lucide-react"
import CalendarMini from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { CalendarValue } from "@/types/calendarValue"

const rendezVous = [
    { date: "2025-11-05", title: "Consultation client", time: "09h00" },
    { date: "2025-11-06", title: "Réunion équipe", time: "14h30" },
    { date: "2025-11-07", title: "Rendez-vous fournisseur", time: "11h00" },
    { date: "2025-11-08", title: "Audit interne", time: "10h00" },
]


export default function Calendars() {
    const [date, setDate] = useState<CalendarValue>(new Date())

    const getRdvForDate = (d: Date) =>
        rendezVous.filter(r => r.date === d.toISOString().slice(0, 10))

    return (

        <>
            <div className="flex items-center justify-between mb-3 mt-4">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Rendez-vous
                </h3>
            </div>


            <CalendarMini onChange={setDate}  value={date}  className="border-0 shadow-none text-xs text-gray-700 mb-4 [&_.react-calendar__tile--active]:bg-[#b07b5e] [&_.react-calendar__tile--active]:text-white"
                tileContent={({ date: tileDate }) =>
                    getRdvForDate(tileDate).length ? (
                        <div className="flex flex-col items-center mt-1">
                            <span className="block text-[10px] text-[#b07b5e]">•</span>
                        </div>
                    ) : null
                }
            />
        </>


    )
}
