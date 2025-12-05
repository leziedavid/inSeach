"use client"

import WhatsAppButton from "@/components/page/WhatsAppButton"
import Sellers from "@/components/boutique/Sellers"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import MyModal from "@/components/modal/MyModal"
import Cart from "@/components/boutique/Cart"

export default function Page() {

  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ffffff] relative overflow-hidden">
      <div className="bg-[#ffffff] w-full max-w-md h-screen flex flex-col rounded-3xl overflow-hidden">

        {/* HEADER PERSONNALISÉ avec retour + titre */}
        <div className="flex items-center justify-between w-full px-6 pt-6 pb-3 shrink-0">
          {/* Partie gauche : Retour + Titre */}
          <Link href="/coworking" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left w-5 h-5 text-slate-800" >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            <h1 className="font-medium text-sm">Boutique en ligne</h1>
          </Link>

          {/* Partie droite : Actions (comme dans Header original) */}
          <div className="flex items-center gap-3">
            {/* Bouton Boutique - masqué car on est déjà dans la boutique */}
            <button onClick={() => setOpen(true)} className="relative bg-[#b07b5e] p-2.5 rounded-full hover:bg-gray-200 transition">
              <ShoppingBag className="w-4 h-4 text-white animate-bounce" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
          <Sellers />
        </div>

        <MyModal open={open} onClose={() => setOpen(false)}>
          <Cart />
        </MyModal>

      </div>

      {/* WHATSAPP FLOAT */}
      <WhatsAppButton />
    </main>
  )
}