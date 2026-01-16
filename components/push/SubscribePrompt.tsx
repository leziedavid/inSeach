'use client';

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubscribePromptProps {
	onSubscribe: () => void;
	onDismiss: () => void;
	loading?: boolean;
}

export default function SubscribePrompt({ onSubscribe, onDismiss, loading = false, }: SubscribePromptProps) {
	const [closing, setClosing] = useState(false);

	const handleClose = () => {
		setClosing(true);
		setTimeout(() => onDismiss(), 300); // durée animation sortie
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className={` relative bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-md w-full ${closing ? "animate-slide-out-down" : "animate-slide-in-up"} `} >
				{/* ❌ Croix badge */}
				<button onClick={handleClose} aria-label="Fermer" className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-gray-900 text-white  flex items-center justify-center shadow-lg hover:scale-110 transition-transform" >
					✕
				</button>

				{/* 🔔 Header */}
				<div className="flex items-start gap-4 mb-6">
					<div className="bg-blue-100 p-3 rounded-full">
						<svg
							className="w-6 h-6 text-blue-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24" >
							<path strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</div>

					<div className="flex-1">
						<h3 className="text-lg font-semibold text-gray-900">
							Activer les notifications
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							Recevez automatiquement les alertes importantes concernant votre compte, vos rendez-vous, commandes, annonces et autres informations système.
						</p>
					</div>
				</div>

				{/* 🔘 Switch */}
				<div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
					<Label htmlFor="push-switch" className="text-sm font-medium text-gray-800">
						Notifications activées
					</Label>

					<Switch
						id="push-switch"
						disabled={loading}
						onCheckedChange={(checked) => {
							if (checked) {
								onSubscribe(); // 🔥 inchangé
							}
						}}
					/>
				</div>

				{loading && (
					<p className="text-xs text-gray-500 text-center mt-3">
						Activation en cours…
					</p>
				)}
			</div>
		</div>
	);
}
