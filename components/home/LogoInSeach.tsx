import { Search } from "lucide-react"

export const LogoInSeach = () => (
    <div className="flex justify-center items-center mb-3 sm:mb-4">
        <div className="relative flex items-end">
            {/* Icône – alignée au pied du "i" */}
            <Search
                className="
          absolute
          bottom-4
          left-2
          w-6 h-6 sm:w-8 sm:h-8
          text-[#b07b5e]
          animate-pulse
        "
            />

            {/* Texte MOBILE : "in" */}
            <h1
                className="
          sm:hidden
          text-transparent bg-clip-text
          bg-gradient-to-r from-[#b07b5e] to-[#155e75]
          font-black text-3xl tracking-tight select-none
          pl-8
        "
            >
                in
            </h1>

            {/* Texte DESKTOP : "inSeach" */}
            <h1
                className="
          hidden sm:block
          text-transparent bg-clip-text
          bg-gradient-to-r from-[#b07b5e] to-[#155e75]
          font-black text-4xl tracking-tight select-none
          pl-10
        "
            >
                inSeach
            </h1>
        </div>
    </div>
)
