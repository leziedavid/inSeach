// components/NotificationSettings.tsx
'use client';

import React from 'react';
import { usePushNotifications } from '@/providers/PushNotificationsProvider';

export default function NotificationSettings() {
	const { isSupported, isSubscribed, subscribeToPush, unsubscribeFromPush, loading } = usePushNotifications();

	if (!isSupported) {
		return (
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<p className="text-yellow-800 text-sm">
					Les notifications push ne sont pas supportées par votre navigateur.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg border border-gray-200 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">Notifications Push</h3>
					<p className="text-sm text-gray-600 mt-1">
						{isSubscribed ? 'Vous recevez les notifications' : 'Activez pour recevoir des notifications'}
					</p>
				</div>
				<button
					onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
					disabled={loading}
					className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ isSubscribed ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white' }`} >
					{loading ? 'Chargement...' : isSubscribed ? 'Désactiver' : 'Activer'}
				</button>
			</div>

			{isSubscribed && (
				<div className="mt-4 pt-4 border-t border-gray-200">
					<div className="flex items-center gap-2 text-sm text-green-600">
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<span>Notifications activées sur cet appareil</span>
					</div>
				</div>
			)}
		</div>
	);
}
