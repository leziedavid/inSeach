"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppButton() {
    return (
        <a href="https://wa.me/2250700000000"  target="_blank" rel="noopener noreferrer" className="fixed bottom-22 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1EBE5D] transition z-[100]" >
            <MessageCircle className="w-6 h-6" />
        </a>
    )
}
