"use client"

import { useState } from "react"
import {
  Phone,
  Gift,
  Truck,
  FileText,
  Home,
  Clock,
  Headphones,
  Settings,
  MessageCircle,
  Plus,
  Calendar,
  Package,
} from "lucide-react"
import CalendarMini from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { CalendarValue } from "@/types/calendarValue"
import MyModal from "@/components/modal/MyModal"
import FormRecharge from "@/components/forms/FormRecharge"

// Fake data
const services = [
  { icon: <Phone className="w-5 h-5 text-gray-700" />, label: "Achat d'unité" },
  { icon: <FileText className="w-5 h-5 text-gray-700" />, label: "Souscrire" },
  { icon: <Gift className="w-5 h-5 text-gray-700" />, label: "Carte cadeau" },
  { icon: <Truck className="w-5 h-5 text-gray-700" />, label: "Livraison" },
]

const rendezVous = [
  { date: "2025-11-05", title: "Consultation client", time: "09h00" },
  { date: "2025-11-06", title: "Réunion équipe", time: "14h30" },
  { date: "2025-11-07", title: "Rendez-vous fournisseur", time: "11h00" },
  { date: "2025-11-08", title: "Audit interne", time: "10h00" },
]

const commandes = [
  { client: "Koffi Jean", produit: "Tomates fraîches", heure: "09h30" },
  { client: "Ahoua Marie", produit: "Carottes bio", heure: "11h15" },
  { client: "Tra Bi Lezie", produit: "Menthe verte", heure: "15h00" },
]

const footerNav = [
  { icon: <Home />, label: "Accueil", key: "home" },
  { icon: <Clock />, label: "Historique", key: "history" },
  { icon: <Headphones />, label: "Support", key: "support" },
  { icon: <Settings />, label: "Paramètres", key: "settings" },
]

export default function HomePage() {
  const [active, setActive] = useState("home")
  const [date, setDate] = useState<CalendarValue>(new Date())
  const [open, setOpen] = useState(false)
  // Helper pour filtrer les rendez-vous par date
  const getRdvForDate = (d: Date) =>
    rendezVous.filter(r => r.date === d.toISOString().slice(0, 10))

  // Fonction compatible avec react-calendar
  const handleDateChange = (value: CalendarValue, event: React.MouseEvent<HTMLButtonElement>) => {
    setDate(value)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="bg-white w-full max-w-sm h-[95vh] flex flex-col justify-between rounded-3xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between w-full px-6 pt-6 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#b07b5e33] rounded-full flex items-center justify-center font-semibold text-[#b07b5e] text-lg">
              T
            </div>
            <div>
              <p className="text-sm text-gray-500 leading-tight">Salut, 👋</p>
              <p className="font-semibold text-gray-800 text-sm">TDL LEZIE</p>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="bg-gray-100 p-2.5 rounded-full hover:bg-gray-200 transition">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* CONTENU SCROLLABLE */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 hide-scrollbar">

          {/* 🎵 Nouveau player audio */}
          <div className="p-1 transition-all duration-300 ease-out mb-6">
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <button
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#b07b5e] hover:bg-[#9a6d54] rounded-full transition-all shadow-sm hover:scale-105 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-play w-5 h-5 text-white ml-0.5"
                  >
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="w-full">
                    <div className="bg-[#b07b5e33] h-2 rounded-full overflow-hidden">
                      <div className="w-3/5 h-full bg-[#b07b5e] animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Titre */}
          <p className="text-gray-900 font-semibold text-base mb-5">
            Quel service cherchez-vous ?
          </p>

          <div className="mt-4 mb-4">
            <input type="text" placeholder="Rechercher un service ..."
              className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33]" />
          </div>

          {/* Services */}
          <div className="grid grid-cols-3 gap-4 w-full mb-8">
            {services.map((item, index) => (
              <button key={index} className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl transition" >
                <div className="bg-gray-100 p-5 rounded-full flex items-center justify-center mb-2">
                  {item.icon}
                </div>
                <span className="text-xs text-gray-700 text-center">{item.label}</span>
              </button>
            ))}
          </div>

          {/* 📅 Section calendrier */}
          <div className="w-full mt-4 rounded-2xl p-4 ">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Rendez-vous
              </h3>
              <button className="text-[#b07b5e] text-xs font-medium hover:underline">
                Voir tout
              </button>
            </div>

            {/* Rendez-vous */}
            <div className="space-y-3 mb-5">
              {rendezVous.map((rdv, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{rdv.title}</p>
                    <p className="text-xs text-gray-500">{rdv.time}</p>
                  </div>
                  <span className="text-xs bg-[#b07b5e22] text-[#b07b5e] px-2 py-1 rounded-md">
                    {rdv.date.slice(8)}
                  </span>
                </div>
              ))}
            </div>


            {/* Mini Calendrier totalement borderless */}
            <div className="mb-4">
              <CalendarMini
                onChange={handleDateChange}
                value={date}
                selectRange={true}
                className={`border-0 shadow-none
                [&_.react-calendar__month-view__weekdays]:border-0
                [&_.react-calendar__month-view__days__day]:border-0
                [&_.react-calendar__tile]:border-0
                [&_.react-calendar__tile]:bg-transparent
                [&_.react-calendar__tile]:outline-none
                [&_.react-calendar__tile--hover]:bg-transparent
                [&_.react-calendar__tile--now]:bg-transparent
                [&_.react-calendar__tile--active]:bg-[#b07b5e] [&_.react-calendar__tile--active]:text-white
                text-xs text-gray-700
              `}
                tileContent={({ date: tileDate }) => {
                  const rdvs = getRdvForDate(tileDate)
                  return rdvs.length ? (
                    <div className="flex flex-col items-center mt-1">
                      {rdvs.map((r, idx) => (
                        <span
                          key={idx}
                          className="block text-[10px] text-[#b07b5e]"
                          title={r.title}
                        >
                          •
                        </span>
                      ))}
                    </div>
                  ) : null
                }}
              />
            </div>


            {/* Commandes du jour */}
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2 mb-3">
              <Package className="w-4 h-4" /> Commandes du jour
            </h3>

            <div className="space-y-3">
              {commandes.map((cmd, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{cmd.produit}</p>
                    <p className="text-xs text-gray-500">{cmd.client}</p>
                  </div>
                  <span className="text-xs bg-[#b07b5e22] text-[#b07b5e] px-2 py-1 rounded-md">
                    {cmd.heure}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-8" />
        </div>

        {/* FOOTER NAV */}
        <nav className="flex justify-around bg-white py-4 shadow-md rounded-b-[2rem] border-b-2 border-gray-200 relative z-10">
          {footerNav.map(item => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`flex flex-col items-center text-sm ${active === item.key ? "text-[#b07b5e]" : "text-gray-500"
                }`}
            >
              <div className="w-5 h-5">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
        
      </div>

      {/* Bouton WhatsApp */}
      <a href="https://wa.me/2250700000000" target="_blank" rel="noopener noreferrer" className="fixed bottom-20 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1EBE5D] transition z-20"  >
        <MessageCircle className="w-6 h-6" />
      </a>


      <MyModal open={open} onClose={() => setOpen(false)}>
        <FormRecharge />
      </MyModal>

    </main>
  )
}