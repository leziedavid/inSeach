"use client";

import { Bot, ChevronRight, Library, MessageCircle } from 'lucide-react';
import React from 'react';
import {LucideIcon} from 'lucide-react';



interface CardContentProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick: () => void;
}


// CardContent Component
const CardContent: React.FC<CardContentProps> = ({ icon: Icon, title, description, onClick }) => {
    
    return (
        <button
            onClick={onClick}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-500 hover:shadow-lg transition-all duration-200 text-left w-full"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-white" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {description}
                    </p>
                </div>
                <ChevronRight  size={20}   className="text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0"  />
            </div>
        </button>
    );
};

export default CardContent;